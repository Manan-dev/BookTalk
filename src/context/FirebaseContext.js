import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
	createUserWithEmailAndPassword,
	getAuth,
	getReactNativePersistence,
	initializeAuth,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getFirestore,
	onSnapshot,
	setDoc,
	getDocs, // Add this import
} from 'firebase/firestore'; // Modify this import
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { createContext } from 'react';
import { firebaseConfig } from '../../firebaseConfig';
import { addISOWeekYears } from 'date-fns';

const FirebaseContext = createContext();

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

initializeAuth(app, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const auth = getAuth(app);

const Firebase = {
	getCurrentUser: () => {
		return auth.currentUser;
	},
	createUser: async user => {
		try {
			await createUserWithEmailAndPassword(auth, user.email, user.password);
			const uid = Firebase.getCurrentUser().uid;

			await setDoc(doc(db, 'users', uid), {
				username: user.username,
				email: user.email,
			});

			delete user.password;
			return { ...user, uid };
		} catch (error) {
			console.log('Error @createUser: ', error.message);
			return { error };
		}
	},
	uploadProfilePhoto: async uri => {
		const uid = Firebase.getCurrentUser().uid;

		try {
			const photo = await Firebase.getBlob(uri);

			const imageRef = ref(storage, `profilePhotos/${uid}/profilePhoto`);

			await uploadBytes(imageRef, photo);

			const url = await getDownloadURL(imageRef);

			await setDoc(
				doc(db, 'users', uid),
				{
					profilePhotoUrl: url,
				},
				{ merge: true }
			);

			return url;
		} catch (error) {
			console.log('Error @uploadProfilePhoto: ', error.message);
		}
	},
	getBlob: async uri => {
		return await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function () {
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', uri, true);
			xhr.send(null);
		});
	},

	getUserInfo: async uid => {
		try {
			const user = await getDoc(doc(db, 'users', uid));
			if (user.exists) {
				return user.data();
			}
		} catch (error) {
			console.log('Error @getUserInfo: ', error.message);
		}
	},
	signin: async (email, password) => {
		await signInWithEmailAndPassword(auth, email, password);
	},
	logout: async () => {
		try {
			await auth.signOut();
			return true;
		} catch (error) {
			console.log('Error @logOut: ', error.message);
		}
		return false;
	},
	sendMessage: async (recipientId, recipientName, message) => {
		try {
			const senderId = Firebase.getCurrentUser().uid;
			const chatId = generateChatId(senderId, recipientId);
			const userInfo = await Firebase.getUserInfo(senderId);

			await addDoc(collection(db, 'chats', chatId), {
				senderId,
				recipientId,
				senderName: userInfo.username,
				message,
				recipientName,
				timestamp: new Date(),
			});
			console.log('Message sent from:', senderId, 'to:', recipientId);
		} catch (error) {
			console.log('Error @sendMessage: ', error.message);
		}
	},

	getAllUsersFromFirestore: async () => {
		try {
			const usersSnapshot = await getDocs(collection(db, 'users'));
			if (usersSnapshot) {
				const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				return users;
			} else {
				console.log('No users found.');
				return [];
			}
		} catch (error) {
			console.error('Error fetching all users:', error);
			throw error;
		}
	},

	getMessagesForChat: async (chatId) => {
		try {
			const chatRef = collection(db, 'chats', chatId);
			const queryRef = orderBy(query(chatRef, 'timestamp'), 'desc'); // Rename the variable to avoid conflict
			const messagesSnapshot = await getDocs(queryRef);
			if (!messagesSnapshot.empty) {
				const lastMessage = messagesSnapshot.docs[0].data();
				return {
					text: lastMessage.message,
					timestamp: lastMessage.timestamp.toDate().toLocaleString() // Convert Firestore Timestamp to a readable format
				};
			} else {
				return null;
			}
		} catch (error) {
			console.error('Error fetching messages for chat:', error);
			throw error;
		}
	},

	getMessagesFromFirestore: (recipientId, setMessages) => {
		const senderId = Firebase.getCurrentUser().uid;
		const chatId = generateChatId(senderId, recipientId);

		return onSnapshot(collection(db, 'chats', chatId), snapshot => {
			const messages = [];
			snapshot.forEach(doc => {
				const data = doc.data();
				messages.push({
					id: doc.id,
					senderId: data.senderId,
					message: data.message,
					senderName: data.senderName,
					timestamp: data.timestamp.toDate(), // Convert Firestore Timestamp to JavaScript Date
				});
			});
			setMessages(messages);
		});
	},
};

const generateChatId = (userId1, userId2) => {
	return userId1 < userId2
		? `chats/${userId1}_${userId2}`
		: `chats/${userId2}_${userId1}`;
};

const FirebaseProvider = props => {
	return (
		<FirebaseContext.Provider value={Firebase}>
			{props.children}
		</FirebaseContext.Provider>
	);
};

export { FirebaseContext, FirebaseProvider };
