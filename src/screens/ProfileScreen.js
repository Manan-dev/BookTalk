import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState, useEffect } from 'react';

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
	Share,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Carousel from '../components/Carousel';
import Modal from 'react-native-modal';
import SearchBar from '../components/SearchBar';
import AboutScreen from './AboutScreen'; 
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';
import booksReadData from '../data/booksReadCopy.json';
import futureBooksData from '../data/futureBooks.json';
import mysteryBooksData from '../data/mysteryBooks.json';
import axios from 'axios';
import {BOOK_API_KEY} from '@env';

export default function ProfileScreen() {
	const navigation = useNavigation();

	const [searchResults, setSearchResults] = useState([]);
	const [searchQuery, setSearchQuery] = useState(' ');

	const [user, setUser] = useContext(UserContext);
	const [isModalVisible, setModalVisible] = useState(false);
	const [isModalVisible1, setModalVisible1] = useState(false);
	const firebase = useContext(FirebaseContext);
	const [showMore0, setShowMore0] = useState(false);
	const [showMore1, setShowMore1] = useState(false);
	const [showMore2, setShowMore2] = useState(false);
	const [showMore3, setShowMore3] = useState(false);

	const ellipsisClicked = () => {
		setModalVisible(true);
	};

	const toggleModal = () => {
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
	const handleSearch = async (query) => {

		// Update the searchQuery state
		setSearchQuery(query.trim());

		// Upadate state or make API calls here
		try {
			// Make a GET request to the Books-API using Axios
			const response = await axios.get('https://books-api7.p.rapidapi.com/books/find/title', {
				params: {
					title: query,
				},
				headers: {
					'X-RapidAPI-Key': BOOK_API_KEY,
					'X-RapidAPI-Host': 'books-api7.p.rapidapi.com',
				},
			});

			// Update the state with the search results
			setSearchResults(response.data);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const booksReadTitles = booksReadData.map(book => book.title);
	const futureBooksTitles = futureBooksData.map(book => book.title)
	const mysteryBooksTitles = mysteryBooksData.map(book => book.title)
	const booksLength = booksReadTitles.length + futureBooksTitles.length + mysteryBooksTitles.length
	
	const renderDropdownOptions = () => {
		// Customize your dropdown options
		return (
			<View style={styles.dropdownContainer}>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={onShare}
				>
					<Text>Share Profile</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => navigation.navigate('AboutScreen')}
				>
					<Text>About</Text>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.dropdownOption} 
					onPress={handleLogout}>
					<Text>Log Out</Text>
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
						<Text style={styles.count}>{booksLength}</Text>
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
					<Carousel
						carouselData={booksReadTitles}
						carouselTitle="Books Read"
						showMore={showMore1}
						toggleShowMore={() => setShowMore1(!showMore1)}
						toggleModal={toggleModal}
						posts={false}
						titles={true}
					/>
				</View>
				<View>
					<Carousel
						carouselData={mysteryBooksTitles}
						carouselTitle="Favorite Mystery Books"
						showMore={showMore2}
						toggleShowMore={() => setShowMore2(!showMore2)} 
						toggleModal={toggleModal}
						posts={false}
						titles={true}
					/>
				</View>
				<View>
					<Carousel
						carouselData={futureBooksTitles}
						carouselTitle="To Be Read"
						showMore={showMore3}
						toggleShowMore={() => setShowMore3(!showMore3)}
						toggleModal={toggleModal} 
						posts={false}
						titles={true}
					/>
				</View>
				<Modal isVisible={isModalVisible1} onBackdropPress={() => setModalVisible1(true)}>
					<View style={styles.modalContainer}>
						<View style={styles.searchModal}>
							<SearchBar
								onSearch={handleSearch}
							/>
							{/* Display search recommendations in a grid */}
							<FlatList
								data={searchResults}
								keyExtractor={(item) => item._id}
								renderItem={({ item }) => (
									<TouchableOpacity onPress={() => setModalVisible1(false)}>
										<Image source={{ uri: item.cover }} style={styles.image} />
									</TouchableOpacity>
								)}
							/>
							<TouchableOpacity style={styles.closeModal} onPress={() => setModalVisible1(false)}>
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
		alignItems:'flex-end',
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
