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

import { format } from 'date-fns';

const ChatScreen = ({ route, navigation }) => {
	const { userId, userName } = route.params;
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
			await firebase.sendMessage(userId, userName, messageInput);
			// Clear message input
			setMessageInput('');
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	useEffect(() => {
		// Subscribe to messages for the current chat from Firestore
		const unsubscribe = firebase.getMessagesFromFirestore(userId, setMessages);

		return () => {
			// Unsubscribe from Firestore when component unmounts
			unsubscribe();
		};
	}, [firebase, userId]);

	useEffect(() => {
		// Scroll to the end of the list when messages change
		if (flatListRef.current) {
			flatListRef.current.scrollToEnd({ animated: true });
		}
	}, [messages]);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.navigate('MessageScreen')}>
					<Ionicons name="arrow-back" size={20} style={styles.icon} />
				</TouchableOpacity>
				<Text style={styles.boldText}>{userName}</Text>
			</View>

			<FlatList
				ref={flatListRef}
				data={messages.sort((a, b) => a.timestamp - b.timestamp)}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<View
						style={[
							styles.messageContainer,
							item.senderId !== userId
								? styles.senderMessage
								: styles.receiverMessage,
						]}
					>
						<Text style={styles.senderName}>
							{item.senderId !== userId ? 'You' : item.senderName}
						</Text>
						<Text style={styles.messageContent}>{item.message}</Text>
						<Text style={styles.timestamp}>
							{format(item.timestamp, 'dd/MM HH:mm')}
						</Text>
					</View>
				)}
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
