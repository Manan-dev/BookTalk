import { Feather, Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	RefreshControl,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';
import ChatScreen from './ChatScreen';
import SearchNewUser from './SearchNewUser';

const Stack = createStackNavigator();

const MessageScreen = ({ navigation }) => {
	// State for search input value
	const [searchInput, setSearchInput] = useState('');

	// State to manage the edit mode
	const [editMode, setEditMode] = useState(false);

	const [chats, setChats] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	const firebase = React.useContext(FirebaseContext);

	const [user, _] = React.useContext(UserContext);

	useEffect(() => {
		fetchChats();
	}, []);

	const fetchChats = async () => {
		try {
			const myChats = await firebase.getChatsForCurrentUser(user.uid);
			setChats(myChats);
		} catch (error) {
			console.error('Error fetching chats:', error);
		} finally {
			setRefreshing(false);
		}
	};

	// Function to handle delete chat
	const handlleDeleteChat = chatId => {
		try {
			firebase.deleteChat(chatId);
			setChats(chats.filter(chat => chat.chatId !== chatId));
		} catch (error) {
			console.error('Error deleting chat:', error);
		}
	};

	const filteredUserData = searchInput
		? chats.filter(chat =>
				chat.recipientData.username
					.toLowerCase()
					.includes(searchInput.toLowerCase())
		  )
		: chats;

	return (
		<View style={styles.container}>
			{/* Header with Edit and New Message icons */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => setEditMode(!editMode)}>
					<Text style={styles.edit}>{editMode ? 'Done' : 'Edit'}</Text>
				</TouchableOpacity>

				<Text style={styles.boldText}>Messages</Text>

				<TouchableOpacity onPress={() => navigation.navigate('SearchNewUser')}>
					<Ionicons name="md-person-add" size={20} style={styles.icon} />
				</TouchableOpacity>
			</View>

			{/* Search bar */}
			<View style={styles.searchContainer}>
				<Feather
					name="search"
					size={20}
					color="black"
					style={styles.searchIcon}
				/>
				<TextInput
					style={styles.searchInput}
					placeholder="Search"
					value={searchInput}
					onChangeText={text => setSearchInput(text)}
				/>
			</View>

			{/* List of user chats */}
			<FlatList
				data={filteredUserData}
				keyExtractor={item => item.chatId}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.chatContainer}
						onPress={() =>
							navigation.navigate('ChatScreen', {
								currentUserId: user.uid,
								recepientId: item.recipientData.id,
							})
						}
					>
						{/* User profile image on the left */}
						<Image
							source={{ uri: item.recipientData.profilePhotoUrl }}
							style={styles.profileImage}
						/>

						<View style={styles.chatContent}>
							<View style={{ borderWidth: 1, maxWidth: '80%' }}>
								<Text style={styles.userName}>
									{item.recipientData.username}
								</Text>
								<Text style={styles.lastMessage}>
									{item.lastMessage && item.lastMessage.content}
								</Text>
							</View>
							<View style={styles.lastMessageTimeContainer}>
								<Text style={styles.lastMessageTime}>
									{item.lastMessage && item.lastMessage.timestamp
										? new Date(
												item.lastMessage.timestamp.seconds * 1000 +
													item.lastMessage.timestamp.nanoseconds / 1000000
										  ).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
										  })
										: ''}
								</Text>
								<Ionicons name="chevron-forward" size={20} color="#888" />
							</View>
						</View>
						{/* Delete icon for edit mode */}
						{editMode && (
							<TouchableOpacity onPress={() => handlleDeleteChat(item.chatId)}>
								<Feather name="trash-2" size={20} color="red" />
							</TouchableOpacity>
						)}
					</TouchableOpacity>
				)}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={fetchChats} />
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	searchContainer: {
		height: 40,
		width: '90%',
		alignItems: 'center',
		flexDirection: 'row',
		margin: 17,
		justifyContent: 'center',
		borderColor: 'gray',
		borderWidth: 1,
		paddingHorizontal: 10,
		marginTop: 10,
		marginBottom: 10,
		borderRadius: 10,
	},
	icon: {
		color: '#E9446A',
		marginRight: 5,
	},
	searchIcon: {
		marginRight: 10,
	},
	searchInput: {
		flex: 1,
		height: 40,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 10,
	},
	boldText: {
		fontWeight: 'bold',
		fontSize: 16,
	},
	edit: {
		fontSize: 16,
		color: '#E9446A',
	},
	chatContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	profileImage: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 10,
	},

	userInfo: {
		flex: 1,
	},
	userName: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	userMessage: {
		color: '#888',
	},
	chatContent: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginRight: 10,
	},

	lastMessageTimeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	lastMessageTime: {
		fontSize: 12,
		color: '#888',
		marginRight: 5,
	},
	messageInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		bottom: 15,
		padding: 10,
		borderTopWidht: 1,
		borderTopColor: '#ccc',
	},
	messageInput: {
		flex: 1,
		height: 40,
		marginRight: 10,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 10,
	},
});

export default () => (
	<Stack.Navigator>
		<Stack.Screen
			name="MessageScreen"
			component={MessageScreen}
			options={{ headerShown: false }}
		/>
		<Stack.Screen
			name="ChatScreen"
			component={ChatScreen}
			options={{ headerShown: false }}
		/>
		<Stack.Screen
			name="SearchNewUser"
			component={SearchNewUser}
			options={{ headerShown: false }}
		/>
	</Stack.Navigator>
);
