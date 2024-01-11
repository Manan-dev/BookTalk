import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext } from 'react';

import {
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
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';
import booksReadData from '../data/booksRead.json';
import futureBooksData from '../data/futureBooks.json';
import mysteryBooksData from '../data/mysteryBooks.json';

export default function ProfileScreen() {
	const [user, setUser] = useContext(UserContext);
	const firebase = useContext(FirebaseContext);

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
				</View>
				<TextInput
					multiline
					numberOfLines={4}
					placeholder="Bio..."
					style={styles.bio}
				></TextInput>

				<View>
					<Carousel carouselData={booksReadData} title="Books Read" />
				</View>
				<View>
					<Carousel
						carouselData={mysteryBooksData}
						title="Best Mystery Books"
					/>
				</View>
				<View>
					<Carousel
						carouselData={futureBooksData}
						title="Books I Want to Read"
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
	content: {
		width: '100%',
		alignItems: 'center',
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
		borderWidth: 1,
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
});
