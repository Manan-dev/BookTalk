import { Feather, Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
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

const Stack = createStackNavigator();

const MessageScreen = ({ navigation }) => {
	// State for search input value
	const [SearchInput, setSearchInput] = useState('');

	// State to manage the edit mode
	const [editMode, setEditMode] = useState(false);

	const firebase = React.useContext(FirebaseContext);

	// Sample data for user chats
	const [userData, setUserData] = useState([
		{
			id: '1',
			name: 'Selena',
			message: 'Looking for a good fantasy series. Any suggetions?',
			pinned: false,
		},
		{
			id: '2',
			name: 'Tia',
			message: 'Lost in the magical world of "Harry Potter" again.',
			pinned: false,
		},
		{
			id: '3',
			name: 'Katie',
			message: 'Any book recommendations for the weekend?',
			pined: false,
		},
		{
			id: '4',
			name: 'Lisa',
			message:
				'Just started a new mystery novel. Excited to see how it unfolds!',
			pined: false,
		},
		{
			id: '5',
			name: 'Paige',
			message: 'Reading a heartwarming romance. Perfect for a cozy evening.',
			pined: false,
		},
		{
			id: '6',
			name: 'Hope',
			message: 'I recently enjoyed "To Kill a Mockingbird".',
			pined: false,
		},
		{
			id: '7',
			name: 'Rue',
			message: 'Just finished an amazing book!',
			pined: false,
		},
		{
			id: '8',
			name: 'Erika',
			message: 'Currently reading a gripping thriller.',
			pined: false,
		},
		// Add more user data as needed
	]);

	// Function to handle delete chat
	const handlleDeleteChat = userId => {
		const updatedData = userData.filter(user => user.id !== userId);
		setUserData(updatedData);
	};

	// Filtered user data based on search input
	const filteredUserData = userData.filter(user =>
		user.name.toLowerCase().includes(SearchInput.toLowerCase())
	);

	return (
		<View style={styles.container}>
			{/* Header with Edit and New Message icons */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => setEditMode(!editMode)}>
					<Text style={styles.edit}>{editMode ? 'Done' : 'Edit'}</Text>
				</TouchableOpacity>

				<Text style={styles.boldText}>Messages</Text>

				<TouchableOpacity
					onPress={() => console.log('New Message button pressed')}
				>
					{/* <Feather name="message-square" size={20} color="black" style={styles.icon} /> */}
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
					style={styles.SearchInput}
					placeholder="Search"
					value={SearchInput}
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
						<Image source={profileImage} style={styles.profileImage} />

						{/* User information and message */}
						<View style={styles.userInfo}>
							<Text style={styles.userName}>{item.name}</Text>
							<Text style={styles.userMessage}>{item.message}</Text>
						</View>

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
	SearchInput: {
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
	</Stack.Navigator>
);
