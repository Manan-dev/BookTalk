import { Feather, Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import profileImage from '../../assets/profile.png';
import { FirebaseContext } from '../context/FirebaseContext';
import ChatScreen from './ChatScreen';
import SearchNewUser from './SearchNewUser';

const Stack = createStackNavigator();

const MessageScreen = ({ navigation }) => {
	// State for search input value
	const [searchInput, setSearchInput] = useState('');

	// State to manage the edit mode
	const [editMode, setEditMode] = useState(false);

	const [chats, setChats] = useState([]);

	const firebase = React.useContext(FirebaseContext);

	useEffect(() => {
		fetchChats();
	}, []);

	const fetchChats = async () => {
		try {
			const fetchedChats = await firebase.getAllUsersFromFirestore();
			setChats(fetchedChats);
		} catch (error) {
			console.error('Error fetching chats:', error);
		}
	};

	// Function to handle delete chat
	const handlleDeleteChat = userId => {
		const updatedData = userData.filter(user => user.id !== userId);
		setUserData(updatedData);
	};

	// Filtered user data based on search input
	// const filteredUserData = searchInput
	// 	? userData.filter(user =>
	// 		user.name.toLowerCase().includes(searchInput.toLowerCase())
	// 		)
	// 	: userData;
	
	const filteredUserData = searchInput
        ? chats.filter(chat => chat.username.toLowerCase().includes(searchInput.toLowerCase()))
        : chats;

	return (
		<View style={styles.container}>
			{/* Header with Edit and New Message icons */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => setEditMode(!editMode)}>
					<Text style={styles.edit}>{editMode ? 'Done' : 'Edit'}</Text>
				</TouchableOpacity>
				
				<Text style={styles.boldText}>Messages</Text>

				<TouchableOpacity
					onPress={() => navigation.navigate('SearchNewUser')}
				>
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
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.chatContainer}
						onPress={() =>
							navigation.navigate('ChatScreen', {
								userId: item.id,
								userName: item.name,
							})
						}
					>
						{/* User profile image on the left */}
						{/* <Image source={profileImage} style={styles.profileImage} /> */}
 						<Image source={{ uri: item.profilePhotoUrl }} style={styles.profileImage} />

						{/* User information and message */}
						{/* <View style={styles.userInfo}>
							<Text style={styles.userName}>{item.name}</Text>
							<Text style={styles.userMessage}>{item.message}</Text>
						</View> */}

						<View style={styles.chatContent}>
	                            <Text style={styles.userName}>{item.username}</Text>
	                           <Text style={styles.lastMessage}>{item.lastMessage}</Text>
	                    </View>
						<Text style={styles.lastMessageTime}>{item.lastMessageTime}</Text>
						{/* Delete icon for edit mode */}
						{editMode && (
							<TouchableOpacity onPress={() => handlleDeleteChat(item.id)}>
								<Feather name="trash-2" size={20} color="red" />
							</TouchableOpacity>
						)}
					</TouchableOpacity>
				)}
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
		// fontWeight: 'bold',
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
	chatContent: {
        flex: 1,
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
	lastMessage: {
        color: '#888',
    },
    lastMessageTime: {
        fontSize: 12,
        color: '#888',
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
			options={{ headerShown: false}}
		/>
	</Stack.Navigator>
);
