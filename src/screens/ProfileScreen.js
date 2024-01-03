import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import React, { useContext } from 'react';
import {
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
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<SafeAreaView style={styles.content}>
				<TouchableOpacity>
					<Ionicons
						name="ios-person-circle-outline"
						size={150}
						color="black"
						style={styles.profilePicIcon}
					/>
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
		marginTop: 50,
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
