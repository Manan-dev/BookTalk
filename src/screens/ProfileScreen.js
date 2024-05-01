import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';

import { BOOK_API_KEY } from '@env';
import axios from 'axios';
import {
	Image,
	Platform,
	RefreshControl,
	ScrollView,
	Share,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-navigation';
import Carousel from '../components/Carousel';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';
import booksReadData from '../data/booksRead.json';
import futureBooksData from '../data/futureBooks.json';
import mysteryBooksData from '../data/mysteryBooks.json';

export default function ProfileScreen() {
	const navigation = useNavigation();

	const [searchResults, setSearchResults] = useState([]);
	const [searchQuery, setSearchQuery] = useState(' ');
	const [followersCount, setFollowerCount] = useState(0);
	const [followingCount, setFollowingCount] = useState(0);
	const [postCount, setPostCount] = useState(0);
	const [refreshing, setRefreshing] = useState(false);

	const [user, setUser] = useContext(UserContext);
	const [bio, setBio] = useState('');
	const [isModalVisible, setModalVisible] = useState(false);
	const [isModalVisible1, setModalVisible1] = useState(false);
	const firebase = useContext(FirebaseContext);
	const [showMore0, setShowMore0] = useState(false);
	const [showMore1, setShowMore1] = useState(false);
	const [showMore2, setShowMore2] = useState(false);

	useEffect(() => {
		// Fetch follower and following counts
		fetchFollowerCount();
		fetchFollowingCount();
		fetchPostCount();
		// Fetch the user's bio when the component mounts
		fetchBio();
	}, []);

	const ellipsisClicked = () => {
		setModalVisible(true);
	};

	const toggleModal = () => {
		setSearchResults([]);
		setModalVisible1(!isModalVisible1);
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	const onShare = async () => {
		try {
			const result = await Share.share({
				message: `Check out my profile: `,
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// Shared with activity type of result.activityType
				} else {
					// Shared
				}
			} else if (result.action === Share.dismissedAction) {
				// Dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};

	// Define a function to handle the search action
	const handleSearch = async query => {
		// Update the searchQuery state
		setSearchQuery(query.trim());

		// If the query is empty, fetch random books
		if (!query.trim()) {
			fetchRandomBooks();
			return;
		}

		// Make API call to Google Books API
		try {
			const response = await axios.get(
				'https://www.googleapis.com/books/v1/volumes',
				{
					params: {
						q: query,
						key: BOOK_API_KEY,
						maxResults: 6,
					},
				}
			);

			// Update the state with the search results
			setSearchResults(response.data.items || []);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const booksReadTitles = booksReadData.map(book => book.title);
	const futureBooksTitles = futureBooksData.map(book => book.title);
	const mysteryBooksTitles = mysteryBooksData.map(book => book.title);
	const booksLength =
		booksReadTitles.length +
		futureBooksTitles.length +
		mysteryBooksTitles.length;

	const renderDropdownOptions = () => {
		// Customize your dropdown options
		return (
			<View style={styles.dropdownContainer}>
				<TouchableOpacity style={styles.dropdownOption} onPress={onShare}>
					<Text>Share Profile</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => navigation.navigate('AboutScreen')}
				>
					<Text>About</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.dropdownOption} onPress={handleLogout}>
					<Text>Log Out</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const handleLogout = async () => {
		const loggedOut = await firebase.logout();

		if (loggedOut) {
			setUser(state => ({ ...state, isLoggedIn: false }));
		}
	};

	const addProfilePic = async () => {
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

	const fetchFollowerCount = async () => {
		try {
			// Call Firebase method to get follower count
			const count = await firebase.getFollowerCount(user.uid);
			setFollowerCount(count);
		} catch (error) {
			console.error('Error fetching follower count:', error);
		}
	};

	const fetchFollowingCount = async () => {
		try {
			// Call Firebase method to get following count
			const count = await firebase.getFollowingCount(user.uid);
			setFollowingCount(count);
		} catch (error) {
			console.error('Error fetching following count:', error);
		}
	};

	const fetchPostCount = async () => {
		try {
			// Call Firebase method to get post count
			const count = await firebase.getPostCount(user.uid);
			setPostCount(count);
		} catch (error) {
			console.error('Error fetching post count:', error);
		}
	};

	const fetchBio = async () => {
		const userData = await firebase.getUserInfo(user.uid);
		if (userData && userData.bio) {
			setBio(userData.bio);
		}
	};

	const updateBio = async () => {
		// Update the bio in the backend
		const success = await firebase.updateUserBio(user.uid, bio);
		if (success) {
			// Update the local state with the new bio
			setUser(prevUser => ({ ...prevUser, bio }));
			console.log('Bio updated successfully');
		} else {
			console.log('Failed to update bio');
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			await Promise.all([
				fetchFollowerCount(),
				fetchFollowingCount(),
				fetchPostCount(),
				fetchBio(),
			]);
		} catch (error) {
			console.error('Error refreshing:', error);
		} finally {
			setRefreshing(false);
		}
	};

	return (
		<ScrollView
			contentContainerStyle={styles.container}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
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
						<Image
							source={{ uri: 'https://www.gravatar.com/avatar/000?d=mp' }}
							style={styles.selectedProfilePic}
						/>
					)}
				</TouchableOpacity>
				<Text style={styles.username}>{user.username}</Text>
				<View style={styles.ffContainer}>
					<View>
						<Text style={styles.count}>{followersCount}</Text>
						<Text>Followers</Text>
					</View>
					<View>
						<Text style={styles.count}>{followingCount}</Text>
						<Text>Following</Text>
					</View>
					<View>
						<Text style={styles.count}>{booksLength}</Text>
						<Text>Books</Text>
					</View>
					<View>
						<Text style={styles.count}>{postCount}</Text>
						<Text>Posts</Text>
					</View>
				</View>
				<TextInput
					multiline
					numberOfLines={4}
					placeholder="Start typing to write your bio!"
					value={bio}
					style={styles.bio}
					onChangeText={setBio}
				></TextInput>
				<TouchableOpacity onPress={updateBio} style={styles.updateBioButton}>
					<Text>Update Bio</Text>
				</TouchableOpacity>
				<View>
					<Carousel
						carouselData={booksReadTitles}
						carouselTitle="Books Read"
						showMore={showMore0}
						toggleShowMore={() => setShowMore0(!showMore0)}
						toggleModal={toggleModal}
						posts={false}
						titles={true}
						isMyProfile={true}
					/>
					<Carousel
						carouselData={futureBooksTitles}
						carouselTitle="To Be Read"
						showMore={showMore1}
						toggleShowMore={() => setShowMore1(!showMore1)}
						toggleModal={toggleModal}
						posts={false}
						titles={true}
						isMyProfile={true}
					/>
					<Carousel
						carouselData={mysteryBooksTitles}
						carouselTitle="Favorite Mystery Books"
						showMore={showMore2}
						toggleShowMore={() => setShowMore2(!showMore2)}
						toggleModal={toggleModal}
						posts={false}
						titles={true}
						isMyProfile={true}
					/>
				</View>

				<Modal
					isVisible={isModalVisible1}
					onBackdropPress={() => setModalVisible1(true)}
				>
					<View style={styles.modalContainer}>
						<View style={styles.searchModal}>
							<SearchBar onSearch={handleSearch} />
							{/* Display search recommendations in a grid */}
							<ScrollView
								contentContainerStyle={{
									flex: 1,
									flexDirection: 'row',
									flexWrap: 'wrap',
								}}
							>
								{searchResults.map(item => (
									<TouchableOpacity
										key={item.id}
										onPress={() => {
											setModalVisible1(false);
											setSearchResults([]);
										}}
										style={{ width: '33.3%' }}
									>
										<Image
											source={{ uri: item.volumeInfo.imageLinks?.thumbnail }}
											style={styles.image}
											resizeMode="contain"
										/>
									</TouchableOpacity>
								))}
							</ScrollView>
							<TouchableOpacity
								style={styles.closeModal}
								onPress={() => setModalVisible1(false)}
							>
								<Text>Close Modal</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
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
		alignItems: 'flex-end',
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
	image: {
		width: 120,
		height: 200,
		margin: 4,
		borderRadius: 4,
	},
	ellipses: {
		alignSelf: 'flex-end',
		marginRight: 20,
	},
	dropdownContainer: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 8,
		alignSelf: 'flex-end',
		marginBottom: 400,
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
	logoutButton: {
		width: 'auto',
		borderRadius: 10,
		alignSelf: 'center',
	},
	closeModal: {
		position: 'absolute',
		bottom: 20,
		right: 20,
		backgroundColor: 'gray',
		width: 100,
		height: 25,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignSelf: 'center',
		width: '110%',
	},
	searchModal: {
		backgroundColor: 'white',
		width: '100%',
		flex: 1,
		marginTop: 100,
		justifyContent: 'flex-start',
		alignItems: 'center',
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
		width: '95%',
		padding: 10,
		fontSize: 18,
		minHeight: 90,
		maxHeight: 90,
		marginBottom: 5,
		marginTop: 20,
		borderWidth: 0,
		backgroundColor: 'rgba(0,0,0,0.1)',
	},
	updateBioButton: {
		backgroundColor: 'rgb(32, 137, 220)',
		padding: 10,
		alignSelf: 'flex-end',
		marginRight: 10,
		borderRadius: 10,
	},
});
