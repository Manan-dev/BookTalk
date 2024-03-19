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
	getDocs,
	getFirestore,
	serverTimestamp,
	setDoc,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { createContext } from 'react';
import { firebaseConfig } from '../../firebaseConfig';

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
	getAllPosts: async () => {
		try {
			const usersSnapshot = await getDocs(collection(db, 'users'));

			const postsPromises = usersSnapshot.docs.map(async userDoc => {
				const profilePhotoUrl = userDoc.data().profilePhotoUrl;
				const username = userDoc.data().username;

				const postsCollection = collection(userDoc.ref, 'posts');
				const postsSnapshot = await getDocs(postsCollection);

				const posts = await Promise.all(
					postsSnapshot.docs.map(async postDoc => {
						const commentsCollection = collection(postDoc.ref, 'comments');
						const commentsSnapshot = await getDocs(commentsCollection);

						const comments = commentsSnapshot.docs.map(commentDoc => ({
							commentId: commentDoc.id,
							postID: postDoc.id,
							commentingUserID: commentDoc.data().userId,
							commentingUsername: commentDoc.data().username,
							commentingUserPhotoURL: commentDoc.data().profilePhotoUrl,
							commentText: commentDoc.data().text,
						}));

						return {
							id: postDoc.id,
							userId: userDoc.id,
							profilePhotoUrl,
							username,
							comments,
							...postDoc.data(),
						};
					})
				);

				return posts;
			});

			const allPosts = await Promise.all(postsPromises);

			// Flatten the array of arrays into a single array
			return allPosts.flat();
		} catch (error) {
			console.error('Error getting posts:', error);
			return [];
		}
	},
	addCommentToFirestore: async (postId, postCreatorUserId, userId, text) => {
		try {
			const commentsRef = collection(
				db,
				`users/${postCreatorUserId}/posts/${postId}/comments`
			);
			const userInfo = await Firebase.getUserInfo(userId);
			await addDoc(commentsRef, {
				userId: userId,
				text: text,
				username: userInfo.username,
				profilePhotoUrl: userInfo.profilePhotoUrl,
				createdAt: serverTimestamp(),
			});
			console.log('Comment added successfully!');
		} catch (error) {
			console.error('Error adding comment: ', error);
		}
	},
};

const FirebaseProvider = props => {
	return (
		<FirebaseContext.Provider value={Firebase}>
			{props.children}
		</FirebaseContext.Provider>
	);
};

export { FirebaseContext, FirebaseProvider };
