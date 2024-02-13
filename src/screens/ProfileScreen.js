import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useState } from 'react';

import {
	FlatList,
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Carousel from '../components/Carousel';
import Modal from 'react-native-modal';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';
import booksReadData from '../data/booksRead.json';
import futureBooksData from '../data/futureBooks.json';
import mysteryBooksData from '../data/mysteryBooks.json';
// import postsData from '../data/postsData.json'

export default function ProfileScreen() {
	const [user, setUser] = useContext(UserContext);
	const [isModalVisible, setModalVisible] = useState(false);
	const firebase = useContext(FirebaseContext);
	
	const ellipsisClicked = () => {
		setModalVisible(true);
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	const handleShowMore = () => {
		setModalVisible(true);
	};

	const renderDropdownOptions = () => {
		// Customize your dropdown options
		return (
			<View style={styles.dropdownContainer}>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Edit Profile')}
				>
					<Text>Edit Profile</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Account Settings')}
				>
					<Text>Account Settings</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Share Profile')}
				>
					<Text>Share Profile</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('About')}
				>
					<Text>About</Text>
				</TouchableOpacity>
			</View>
		);
	};

	handleLogout = async () => {
		const loggedOut = await firebase.logout();

		if (loggedOut) {
			setUser(state => ({ ...state, isLoggedIn: false }));
		}
	};

	addProfilePic = async () => {
		if (Platform.OS !== 'web') {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (status === 'granted') {
				const image = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 0.5,
				});
				if (!image.canceled) {
					const url = await firebase.uploadProfilePhoto(image.assets[0].uri);

					setUser({
						...user,
						profilePhotoUrl: url,
						isLoggedIn: true,
					});
				}
			}
		}
	};
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<SafeAreaView style={styles.content}>
				<View style={styles.container}>
					<Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
						{renderDropdownOptions()}
					</Modal>
				</View>
				<View style={styles.ellipses}>
					<TouchableOpacity onPress={() => ellipsisClicked()}>
						<Ionicons name="ellipsis-horizontal" size={24} color="black" />
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={addProfilePic}>
					{user.profilePhotoUrl ? (
						<Image
							source={{ uri: user.profilePhotoUrl }}
							style={styles.selectedProfilePic}
						/>
					) : (
						<Ionicons
							name="add-circle"
							size={150}
							color="#edebeb"
							style={styles.profilePicIcon}
						/>
					)}
				</TouchableOpacity>
				<Text style={styles.username}>{user.username}</Text>
				<View style={styles.ffContainer}>
					<View>
						<Text style={styles.count}>425</Text>
						<Text>Followers</Text>
					</View>
					<View>
						<Text style={styles.count}>437</Text>
						<Text>Following</Text>
					</View>
					<View>
						<Text style={styles.count}>75</Text>
						<Text>Books</Text>
					</View>
					<View>
						<Text style={styles.count}>29</Text>
						<Text>Posts</Text>
					</View>
				</View>
				<TextInput
					multiline
					numberOfLines={4}
					placeholder="Start typing to write your bio!"
					style={styles.bio}
				></TextInput>

				<View>
					<Carousel title="Posts" />
				</View>
				<View>
					<Carousel carouselData={booksReadData} title="Books Read" />
				</View>
				<View>
					<Carousel
						carouselData={mysteryBooksData}
						title="My Favorite Mystery Books"
					/>
				</View>
				<View>
					<Carousel
						carouselData={futureBooksData}
						title="To Be Read"
					/>
				</View>
				<Button buttonStyle={styles.logoutButton} onPress={handleLogout}>
					Log Out
				</Button>
			</SafeAreaView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	profileContainer: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		alignItems:'flex-end',
	},
	// ellipsesContainer: {
	// 	flexGrow: 1,
	// 	alignItems: 'flex-end'
	// },
	ellipses: {
		alignSelf: 'flex-end',
		marginRight: 20
	},
	dropdownContainer: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 8,
		alignSelf: 'flex-end',
		marginBottom: 400
	},
	dropdownOption: {
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	content: {
		width: '100%',
		alignItems: 'center',
	},
	editProfileButton: {
		width: 'auto',
		borderRadius: 10,
	},
	messageButton: {
		width: 'auto',
		borderRadius: 10,
	},
	logoutButton: {
		width: 'auto',
		borderRadius: 10,
		alignSelf: 'center',
	},
	profilePicIcon: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedProfilePic: {
		width: 150,
		height: 150,
		borderRadius: 150 / 2,
	},
	username: {
		fontSize: 25,
		marginBottom: 20,
	},
	ffContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '80%',
		marginBottom: 20,
	},
	count: {
		fontSize: 30,
		fontWeight: 'bold',
	},
	bio: {
		width: '90%',
		fontSize: 18,
		minHeight: 90,
		maxHeight: 90,
		marginBottom: 20,
		marginTop: 20,
		borderWidth: 0,
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
});
