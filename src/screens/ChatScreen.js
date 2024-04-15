import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { FirebaseContext } from '../context/FirebaseContext';

const ChatScreen = ({ route, navigation }) => {
	const { currentUserId, recepientId } = route.params;
	const firebase = useContext(FirebaseContext);
	const flatListRef = useRef(null); // Reference for FlatList

	// State for the message input
	const [messageInput, setMessageInput] = useState('');
	// State for storing messages
	const [messages, setMessages] = useState([]);

	// Function to handle sending messages
	const handleSendMessage = async () => {
		if (messageInput.trim() === '') return;

		try {
			// Add message to Firestore
			await firebase.sendMessage(currentUserId, recepientId, messageInput);
			// Clear message input
			setMessageInput('');
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};
	useEffect(() => {
		// Define an asynchronous function inside the useEffect
		const fetchMessagesAndSubscribe = async () => {
			try {
				// Subscribe to messages for the current chat from Firestore
				const unsubscribe = await firebase.getMessagesFromFirestore(
					currentUserId,
					recepientId,
					setMessages
				);

				// Return the unsubscribe function
				return unsubscribe;
			} catch (error) {
				console.error('Error subscribing to messages:', error);
				throw error; // Propagate the error to the caller
			}
		};

		// Call the asynchronous function immediately
		fetchMessagesAndSubscribe()
			.then(unsubscribe => {
				// Cleanup function
				return () => {
					// Unsubscribe from messages when the component unmounts
					unsubscribe();
				};
			})
			.catch(error => {
				console.error('Error subscribing to messages:', error);
			});
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.navigate('MessageScreen')}>
					<Ionicons name="arrow-back" size={20} style={styles.icon} />
				</TouchableOpacity>
				{messages.length > 0 && (
					<Text style={styles.boldText}>{messages[0].recipientName}</Text>
				)}
			</View>

			<FlatList
				ref={flatListRef}
				data={messages}
				keyExtractor={(item, index) => `${item.id}-${index}`}
				renderItem={({ item }) =>
					// Conditionally render the outermost view based on item.content
					item.content ? (
						<View
							style={[
								styles.messageContainer,
								item.senderId === currentUserId
									? styles.senderMessage
									: styles.receiverMessage,
							]}
						>
							<Text style={styles.senderName}>
								{item.senderId === currentUserId ? 'You' : item.senderName}
							</Text>
							<Text style={styles.messageContent}>{item.content}</Text>
							{item.timestamp && (
								<Text style={styles.timestamp}>
									{item.timestamp
										? new Date(
												item.timestamp.seconds * 1000 +
													item.timestamp.nanoseconds / 1000000
										  ).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
										  })
										: ''}
								</Text>
							)}
						</View>
					) : null
				}
				onContentSizeChange={() => {
					setTimeout(() => {
						flatListRef.current.scrollToEnd({ animated: true });
					}, 100);
				}}
			/>

			<View style={styles.messageInputContainer}>
				<TextInput
					style={styles.messageInput}
					placeholder="Type a message..."
					value={messageInput}
					onChangeText={text => setMessageInput(text)}
				/>

				<TouchableOpacity onPress={handleSendMessage}>
					<Ionicons name="send" size={20} style={styles.icon} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f9f9f9',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		marginBottom: 10,
	},
	boldText: {
		flex: 1,
		fontWeight: 'bold',
		fontSize: 16,
		color: '#333',
		textAlign: 'center',
	},
	icon: {
		color: '#E9446A',
	},
	messageInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderTopWidth: 1,
		borderTopColor: '#ddd',
		backgroundColor: '#fff',
	},
	messageInput: {
		flex: 1,
		height: 40,
		marginRight: 10,
		borderColor: '#ddd',
		borderWidth: 1,
		borderRadius: 20,
		paddingHorizontal: 15,
		fontSize: 16,
	},
	messageContainer: {
		maxWidth: '80%',
		marginBottom: 10,
		alignSelf: 'flex-start',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 20,
		backgroundColor: '#E8E8E8',
	},
	senderName: {
		fontWeight: 'bold',
		color: '#000',
		marginBottom: 5,
	},
	receiverMessage: {
		alignSelf: 'flex-start',
		backgroundColor: '#e5e5ea',
		color: '#000',
	},
	senderMessage: {
		alignSelf: 'flex-end',
		backgroundColor: '#395dff',
		// backgroundColor: '#7792d3',
		color: '#fff',
	},
	messageContent: {
		fontSize: 16,
		color: '#000',
	},
	timestamp: {
		fontSize: 12,
		color: '#888',
		marginTop: 5,
	},
});

export default ChatScreen;
