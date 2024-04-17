import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
	createUserWithEmailAndPassword,
	getAuth,
	getReactNativePersistence,
	initializeAuth,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	limit,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	where,
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

			const profilePhotoUrl =
				user.profilePhotoUrl || 'https://www.gravatar.com/avatar/000?d=mp';

			await setDoc(doc(db, 'users', uid), {
				username: user.username,
				email: user.email,
				profilePhotoUrl: String(profilePhotoUrl),
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
	updateUserBio: async (uid, bio) => {
		try {
			await setDoc(doc(db, 'users', uid), { bio }, { merge: true });
			return true;
		} catch (error) {
			console.log('Error updating user bio: ', error.message);
			return false;
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
	sendMessage: async (currentUserId, recipientUserId, messageContent) => {
		try {
			// Query to find an existing chat between the current user and the recipient
			const chatQuerySnapshot = await getDocs(
				query(
					collection(db, 'chats'),
					where('users', 'array-contains', currentUserId)
				)
			);

			let chatId;

			// Check if there's an existing chat where the recipient is the sender
			let existingChat = chatQuerySnapshot.docs.find(doc => {
				const chatData = doc.data();
				return chatData.users.includes(recipientUserId);
			});

			// If there's no existing chat, create a new one
			if (!existingChat) {
				const newChatRef = await addDoc(collection(db, 'chats'), {
					users: [currentUserId, recipientUserId],
				});
				chatId = newChatRef.id;
			} else {
				chatId = existingChat.id;
			}

			// Add the message to the chat's messages subcollection
			await addDoc(collection(db, `chats/${chatId}/messages`), {
				senderId: currentUserId,
				timestamp: serverTimestamp(),
				content: messageContent,
			});

			console.log('Message sent successfully!');
		} catch (error) {
			console.error('Error sending message:', error);
		}
	},

	getChatsForCurrentUser: async currentUserId => {
		try {
			// Query to fetch chats where the current user is participating
			const chatsQuerySnapshot = await getDocs(
				query(
					collection(db, 'chats'),
					where('users', 'array-contains', currentUserId)
				)
			);

			// Get chat data
			const chatsData = chatsQuerySnapshot.docs.map(async doc => {
				const chatData = doc.data();
				const chatId = doc.id;
				// Filter out the current user from the users array to get the recipientId
				const recipientId = chatData.users.filter(
					userId => userId !== currentUserId
				)[0];

				// Get last message for each chat
				const lastMessageSnapshot = await getDocs(
					query(
						collection(db, `chats/${chatId}/messages`),
						orderBy('timestamp', 'desc'),
						limit(1)
					)
				);

				let lastMessage = null;
				if (!lastMessageSnapshot.empty) {
					const lastMessageDoc = lastMessageSnapshot.docs[0];
					lastMessage = {
						id: lastMessageDoc.id,
						...lastMessageDoc.data(),
					};
				}

				return {
					chatId,
					recipientId,
					lastMessage,
				};
			});

			// Wait for all chat data to be resolved
			const resolvedChatsData = await Promise.all(chatsData);

			// Fetch recipient data for each chat
			const recipientDataPromises = resolvedChatsData.map(chat =>
				getDoc(doc(db, 'users', chat.recipientId))
			);
			const recipientDataDocs = await Promise.all(recipientDataPromises);
			const recipientData = recipientDataDocs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));

			// Combine chat data with recipient data
			const chatsWithRecipientData = resolvedChatsData.map((chat, index) => ({
				...chat,
				recipientData: recipientData[index],
			}));

			return chatsWithRecipientData;
		} catch (error) {
			console.error('Error fetching chats for current user:', error);
			throw error;
		}
	},

	getMessagesFromFirestore: async (currentUserId, recipientId, setMessages) => {
		try {
			const chatsRef = collection(db, 'chats');

			// Query to find the specific chat between the current user and the recipient
			const chatQuerySnapshot = await getDocs(
				query(chatsRef, where('users', 'array-contains', currentUserId))
			);

			// filter out the chat with the recipient
			let chatDoc;
			// Filter out the chat with the recipient
			chatQuerySnapshot.forEach(doc => {
				const chatData = doc.data();
				if (chatData.users.includes(recipientId)) {
					chatDoc = doc;
				}
			});

			// If the chat exists, subscribe to messages
			if (chatDoc) {
				const chatId = chatDoc.id;
				const messagesRef = collection(db, `chats/${chatId}/messages`);

				// Subscribe to messages for the current chat
				const unsubscribe = onSnapshot(messagesRef, async snapshot => {
					const chatMessages = await Promise.all(
						snapshot.docs.map(async doc => {
							const messageData = doc.data();

							const senderName =
								currentUserId === messageData.senderId
									? 'You'
									: await Firebase.getUserInfo(messageData.senderId).then(
											data => data.username
									  );
							const recipientName = await Firebase.getUserInfo(
								recipientId
							).then(data => data.username);
							return {
								id: doc.id,
								senderName,
								recipientName,
								...messageData,
							};
						})
					);
					chatMessages.sort((a, b) => a.timestamp - b.timestamp); // Sort messages by timestamp
					setMessages(chatMessages);
				});

				// Return the unsubscribe function
				return unsubscribe;
			} else {
				console.log('Chat does not exist');
				// FIX: Property 'recipientName' doesn't exist
				const recipientName = await Firebase.getUserInfo(recipientId).then(
					data => data.username
				);
				setMessages([{ senderName: 'You', recipientName: recipientName }]);
				return () => {}; // Return an empty function as unsubscribe
			}
		} catch (error) {
			console.error('Error fetching messages from Firestore:', error);
			throw error;
		}
	},
	deleteChat: async chatId => {
		try {
			await deleteDoc(doc(db, 'chats', chatId));
			console.log('Chat deleted successfully!');
		} catch (error) {
			console.error('Error deleting chat:', error);
		}
	},
	getAllUsersFromFirestore: async () => {
		try {
			const usersSnapshot = await getDocs(collection(db, 'users'));
			if (usersSnapshot) {
				const users = usersSnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}));
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
	addPostForCurrentUser: async (postText, mergedResults) => {
		try {
			// Get the current user
			const currentUser = Firebase.getCurrentUser();

			// Get the current user's ID
			const currentUserId = currentUser.uid;

			const uploadTasks = [];

			for (const item of mergedResults) {
				// Check if the item contains an imageURL
				if (item.imageURL) {
					const mediaUri = item.imageURL; // Get the URI of the media item
					const nameOfFile = mediaUri.split('/').pop();
					const mediaRef = ref(storage, `media/${currentUserId}/${nameOfFile}`);
					const photo = await Firebase.getBlob(mediaUri);
					// Start the upload task and store the promise
					const uploadTask = uploadBytes(mediaRef, photo).then(() => {
						return getDownloadURL(mediaRef);
					});
					uploadTasks.push(uploadTask);
				}
			}

			// Wait for all upload tasks to complete
			const mediaUrls = await Promise.all(uploadTasks);

			// Create a new post object
			const newPost = {
				caption: postText || '',
				imageURL: mediaUrls[0] || '',
				book: mergedResults[0]?.book || '',
				createdAt: serverTimestamp(),
			};

			// Add the new post document to the 'posts' subcollection of the current user
			const docRef = await addDoc(
				collection(db, `users/${currentUserId}/posts`),
				newPost
			);
			console.log('Post added with ID: ', docRef.id);
		} catch (error) {
			console.error('Error adding post: ', error);
		}
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

						const likesCollection = collection(postDoc.ref, 'likes');
						const likeQuery = query(
							likesCollection,
							where('userId', '==', Firebase.getCurrentUser().uid)
						);
						const likeSnapshot = await getDocs(likeQuery);
						const isLikedByCurrentUser = !likeSnapshot.empty;

						return {
							id: postDoc.id,
							userId: userDoc.id,
							profilePhotoUrl,
							username,
							comments,
							isLikedByCurrentUser,
							...postDoc.data(),
						};
					})
				);

				return posts;
			});

			const allPosts = await Promise.all(postsPromises);

			// Flatten the array of arrays into a single array
			const flattenedPosts = allPosts.flat();

			// Sort the posts by the createdAt property in descending order
			const sortedPosts = flattenedPosts.sort(
				(a, b) => b.createdAt - a.createdAt
			);

			return sortedPosts;
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
	addLikedPostToFirestore: async (postId, postCreatorUserId, userId) => {
		try {
			const likesRef = collection(
				db,
				`users/${postCreatorUserId}/posts/${postId}/likes`
			);
			const userInfo = await Firebase.getUserInfo(userId);
			await addDoc(likesRef, {
				userId: userId,
				likedAt: serverTimestamp(),
				username: userInfo.username,
			});
			console.log('Liked post added to database.', userId, postId);
		} catch (error) {
			console.error('Error adding liked post to database:', error);
		}
	},
	removeLikedPostFromFirestore: async (postId, postCreatorUserId, userId) => {
		try {
			const likesRef = collection(
				db,
				`users/${postCreatorUserId}/posts/${postId}/likes`
			);

			// Query the like entry by userId and delete it
			const querySnapshot = await getDocs(
				query(likesRef, where('userId', '==', userId))
			);
			querySnapshot.forEach(async doc => {
				await deleteDoc(doc.ref);
				console.log('Like removed from database.', userId, postId);
			});
		} catch (error) {
			console.error('Error removing like from database:', error);
		}
	},
	resetPassword: async email => {
		sendPasswordResetEmail(auth, email)
			.then(() => {
				console.log('Password reset email sent to', email);
			})
			.catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log('Error @resetPassword: ', errorCode, errorMessage);
			});
	},
	checkFollowStatus: async (currentUserId, profileUserId) => {
		try {
			const docSnapshot = await getDoc(
				doc(db, `followers/${currentUserId}/following/${profileUserId}`)
			);
			return docSnapshot.exists();
		} catch (error) {
			console.error('Error checking follow status:', error);
			return false;
		}
	},

	followUser: async profileUserId => {
		try {
			const currentUserId = Firebase.getCurrentUser().uid;
			const followingRef = doc(
				db,
				`followers/${currentUserId}/following/${profileUserId}`
			);
			const followersRef = doc(
				db,
				`followers/${profileUserId}/followers/${currentUserId}`
			);
			await Promise.all([
				setDoc(followingRef, { timestamp: serverTimestamp() }),
				setDoc(followersRef, { timestamp: serverTimestamp() }),
			]);
			console.log('User followed successfully!');
		} catch (error) {
			console.error('Error following user:', error);
		}
	},

	unfollowUser: async profileUserId => {
		try {
			const currentUserId = Firebase.getCurrentUser().uid;
			const followingRef = doc(
				db,
				`followers/${currentUserId}/following/${profileUserId}`
			);
			const followersRef = doc(
				db,
				`followers/${profileUserId}/followers/${currentUserId}`
			);
			await Promise.all([deleteDoc(followingRef), deleteDoc(followersRef)]);
			console.log('User unfollowed successfully!');
		} catch (error) {
			console.error('Error unfollowing user:', error);
		}
	},
	getFollowerCount: async userId => {
		try {
			// Query the 'followers' collection for the specified user
			const followersSnapshot = await getDocs(
				collection(db, `followers/${userId}/followers`)
			);
			// Return the number of followers
			return followersSnapshot.size;
		} catch (error) {
			console.error('Error fetching follower count:', error);
			throw error;
		}
	},

	getFollowingCount: async userId => {
		try {
			// Query the 'following' collection for the specified user
			const followingSnapshot = await getDocs(
				collection(db, `followers/${userId}/following`)
			);
			// Return the number of users the specified user is following
			return followingSnapshot.size;
		} catch (error) {
			console.error('Error fetching following count:', error);
			throw error;
		}
	},
	getPostCount: async userId => {
		try {
			// Query the 'posts' collection for the specified user
			const postsSnapshot = await getDocs(
				collection(db, `users/${userId}/posts`)
			);
			// Return the number of posts
			return postsSnapshot.size;
		} catch (error) {
			console.error('Error fetching post count:', error);
			throw error;
		}
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
