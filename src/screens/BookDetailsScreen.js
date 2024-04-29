import React, {useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, ImageBackground, Text, View, ScrollView, Share, TouchableOpacity, Button, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import {BOOK_API_KEY} from '@env';


const BookDetailsScreen = ({ route }) => {
	const navigation = useNavigation();
	const { title, authors, imageLinks, description, backScreen } = route.params;
	const [isModalVisible, setModalVisible] = useState(false);
	const [booksByAuthor, setBooksByAuthor] = useState([]);
	const [showFullReview, setShowFullReview] = useState(false);

	const handleBackNavigation = () => {
		navigation.navigate(backScreen);
	};

	const addClicked = () => {
		setModalVisible(true);
	};

	const toggleModal = () => {
		setModalVisible1(!isModalVisible1);
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	useEffect(() => {
       fetchBooksByAuthor(authors);
    }, [authors]);

	const fetchBooksByAuthor = async (author) => {
		try {
			const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
			let responseData = [];
	
			const options = {
				method: 'GET',
				url: 'https://www.googleapis.com/books/v1/volumes',
				params: {
					q: `inauthor:${author}`, // Search by author
					maxResults: 3, // Limit to 3 results per query
					key: BOOK_API_KEY, // Replace with your Google Books API key
				},
			};
	
			try {
				const response = await axios.request(options);
				responseData.push(response.data); // Accumulate responses
			} catch (error) {
				console.error(error);
			}
	
			setBooksByAuthor(responseData[0].items); // Update state with all responses
		} catch (error) {
			console.error(error);
			setBooksByAuthor([]); // Update state in case of error
		}
	};	

	const handleBookPress = book => {
		const { title, authors, imageLinks, description} = book.volumeInfo;
		const backScreen = "Profile";
		navigation.navigate('BookDetailsScreen', {
			title,
			authors,
			imageLinks,
			description,
			backScreen
		});
	};

	const renderDropdownOptions = () => {
		// Customize your dropdown options
		return (

			<View style={styles.dropdownContainer}>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Books Read')}
				>
					<Text>Books Read</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Favorite Mystery Books')}
				>
					<Text>Favorite Mystery Books</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('To Be Read')}
				>
					<Text>To Be Read</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Check out this book: ${title}`,
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

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.backButtonContainer}>
				<TouchableOpacity onPress={handleBackNavigation}>
					<Ionicons name="arrow-back" size={20} style={styles.icon} />
				</TouchableOpacity>
				<TouchableOpacity onPress={handleBackNavigation}>
					<Text style={styles.backButton}>Back</Text>
				</TouchableOpacity>
			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 35}}>
				<View>
					<Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
						{renderDropdownOptions()}
					</Modal>
				</View>
				<TouchableOpacity style={{marginRight: 310}} onPress={() => addClicked()}>
					<Text style={{ fontSize: 25, color: '#006ee6' }}>+</Text>
				</TouchableOpacity>
				<TouchableOpacity style={{marginRight: 10}} onPress={onShare}>
					<Ionicons name="ios-share" size={26} color="#007AFF" />
				</TouchableOpacity>
        	</View>
			<View style={styles.container}>
				{/* Add background image */}
				<ImageBackground source={{ uri: imageLinks.thumbnail }} style={styles.backgroundImage} imageStyle={{ opacity: 0.7 }}>
					<View style={styles.imageContainer}>
						{/* Add cover image */}
						<Image source={{ uri: imageLinks.smallThumbnail }} style={styles.coverImage} />
					</View>
					<View style={styles.contentContainer}>
						<View style={styles.detailsContainer}>
						</View>
					</View>
				</ImageBackground>
			</View>


			{/* Add book details content */}
			<View style={styles.detailsContainer}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.author}>{`${authors[0]}`}</Text>
			 	<Text style={styles.plot}>{description}</Text>
			</View>

			<Text style={styles.moreBooksSubheading}>More Books By This Author</Text>
			<View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
				{/* Add more books by this author */}
				{booksByAuthor.map((book, index) => (
					<View key={index}>
						<TouchableOpacity onPress={() => handleBookPress(book)}>
							{book.volumeInfo.imageLinks.thumbnail ? (
								<Image source={{ uri: book.volumeInfo.imageLinks.thumbnail }} style={styles.moreBooksImage} />
							) : <Text>undefined</Text>}
						</TouchableOpacity>
					</View>
				))}
			</View>

		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
        flexGrow: 1,
    },
	modalContainer: {
		flexGrow: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	dropdownContainer: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 8,
		alignSelf: 'flex-start',
		marginBottom: 350
	},
	dropdownOption: {
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    imageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
	coverImage: {
		width: 200,
		height: 300,
		marginTop: 200,
	},
	moreBooksImage: {
		height: 180,
		aspectRatio: 2/3,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		marginRight: 10,
	},
	backButtonContainer: {
		position: 'absolute',
		top: 20,
		left: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	backButton: {
		fontSize: 16,
		fontWeight: 'bold',
		// color: 'blue',
		marginLeft: 5,
		
		marginRight: 5,
	},
	detailsContainer: {
		alignItems: 'center',
		marginTop: 160,
		padding: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	author: {
		fontSize: 18,
		marginBottom: 5,
		textAlign: 'center',
	},
	plot: {
		fontSize: 16,
		textAlign: 'justify',
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	moreBooksSubheading: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 10,
		marginTop: 25,
		marginLeft: 5,
	},
	reviewsSubheading: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 10,
		marginTop: 25,
	},
	reviewsContainer: {
		marginLeft: 5,
	},
	reviewName: {
		fontWeight: 'bold',
		fontSize: 15,
		marginLeft: 5,
	},
	reviewBody: {
		marginLeft: 5,
		marginRight: 10,
		backgroundColor: '#dbdad7',
		textAlign: 'justify'
	},
	item: {
		width: 115,
		height: 160,
		borderWidth: 1,
	},
});

export default BookDetailsScreen;
