import React, { useContext, useEffect, useState } from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';

const SearchNewUser = ({ navigation }) => {
	const [searchInput, setSearchInput] = useState('');
	const [users, setUsers] = useState([]); // State to store the original list of users
	const [searchResults, setSearchResults] = useState([]);
	const firebase = useContext(FirebaseContext);
	const [user, _] = useContext(UserContext);

	useEffect(() => {
		// Load initial user list when component mounts
		loadUserList();
	}, []);

	const loadUserList = async () => {
		try {
			const usersSnapshot = await firebase.getAllUsersFromFirestore();
			if (usersSnapshot.length > 0) {
				const usersData = usersSnapshot.map(userDoc => ({
					id: userDoc.id,
					...userDoc,
				}));
				setUsers(usersData); // Store the original list of users
				// setSearchResults(usersData); // Set searchResults initially
				// console.log('usersData:', usersData);
			} else {
				console.log('No user data found in snapshot.');
			}
		} catch (error) {
			console.error('Error loading users:', error);
		}
	};

	const handleSearch = async () => {
		try {
			const filteredUsers = users.filter(user =>
				user.username.toLowerCase().includes(searchInput.toLowerCase())
			);
			setSearchResults(filteredUsers);
		} catch (error) {
			console.error('Error filtering users:', error);
		}
	};

	const handleUserPress = recepientId => {
		navigation.navigate('ChatScreen', {
			currentUserId: user.uid,
			recepientId: recepientId.id, // Assuming 'id' is the property containing the user ID
		});
	};

	const renderSearchBar = () => {
		return (
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder="Search for users..."
					value={searchInput}
					onChangeText={setSearchInput}
					onSubmitEditing={handleSearch}
				/>
				<TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
					<Text style={styles.searchButtonText}>Search</Text>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			{renderSearchBar()}
			{/* Search results list */}
			<FlatList
				data={searchResults}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.resultItem}
						onPress={() => handleUserPress(item)}
					>
						<Text>{item.username}</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
	},
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	searchInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
	},
	searchButton: {
		backgroundColor: '#007AFF',
		padding: 10,
		borderRadius: 5,
	},
	searchButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	resultItem: {
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		marginBottom: 5,
	},
});

export default SearchNewUser;
