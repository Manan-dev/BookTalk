import { BOOK_API_KEY } from '@env';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Book from './Book.js';

const Carousel = ({
	carouselData,
	carouselTitle,
	showMore,
	toggleShowMore,
	toggleModal,
	posts,
	isMyProfile,
	titles: books,
}) => {
	const navigation = useNavigation();
	const [booksByTitle, setBooksByTitle] = useState([]);

	useEffect(() => {
		if (carouselData) {
			// Fetch books by titles here
			fetchBooksByTitles(carouselData);
		}
	}, [carouselData]);

	const fetchBooksByTitles = async titles => {
		try {
			const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
			let responseData = [];
	
			for (const title of titles) {
				const options = {
					method: 'GET',
					url: 'https://www.googleapis.com/books/v1/volumes',
					params: {
						q: `intitle:${title}`, // Search by title
						maxResults: 1, // Limit to 1 result per query
						printType: 'books',
						key: BOOK_API_KEY,
					},
				};
	
				try {
					const response = await axios.request(options);
					responseData.push(response.data); // Accumulate responses
				} catch (error) {
					console.error(error.response.data.error.message);
				}

				// Add delay between requests
				await delay(1000);
			}
	
			setBooksByTitle(responseData); // Update state with all responses
		} catch (error) {
			console.error(error);
			setBooksByTitle([]); // Update state in case of error
		}

	};

	const handleBookPress = book => {
		const { title, authors, imageLinks, description} = book.volumeInfo;
		const backScreen = "Profile"
		navigation.navigate('BookDetailsScreen', {
			title,
			authors,
			imageLinks,
			description,
			backScreen
		});
	};

	const renderItem = ({ item }) => {
		if (!item || !item.volumeInfo) {
			return null;
		}
	
		const book = item;
	
		return (
			<View style={styles.item}>
				<Book
					title={book.volumeInfo.title || 'Unknown Title'}
					author={book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}
					description={book.volumeInfo.description || 'No description available'}
					onPress={() => handleBookPress(book)}
				/>
			</View>
		);
	};
		
		

	const handleModalButtonPress = () => {
		toggleModal(); // Call the toggleModal function passed down from the parent component
	};

	const renderShowMoreButton = () => (
		<View style={styles.carouselButtonContainer}>
			<TouchableOpacity onPress={toggleShowMore} style={styles.showMoreButton}>
				<Text style={{ color: '#006ee6' }}>
					{showMore ? 'Show Less' : 'Show More >'}
				</Text>
			</TouchableOpacity>
			{posts === false && isMyProfile === true && (
				<TouchableOpacity
					style={styles.addMore}
					onPress={handleModalButtonPress}
				>
					<Text style={{ fontSize: 25, color: '#006ee6' }}>+</Text>
				</TouchableOpacity>
			)}
		</View>
	);

	return (
		<View style={styles.container}>
			<Text h4 h4Style={{ fontSize: 20, marginBottom: 5 }}>
				{carouselTitle}
			</Text>
	
			{books === true && (
				<>
					<FlatList
						data={showMore ? booksByTitle : booksByTitle.slice(0, 5)}
						renderItem={({ item }) => (
							<View style={styles.item}>
								<Book book={item.items[0]} onPress={handleBookPress} />
							</View>
						)}
						keyExtractor={(item, index) => index.toString()}
						horizontal
						showsHorizontalScrollIndicator={false}
					/>
					{booksByTitle.length > 5 && renderShowMoreButton()}
				</>
			)}
		</View>
	);	
};

export default Carousel;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 212,
		paddingLeft: 5,
		paddingTop: 5,
		marginBottom: 10,
		position: 'relative',
	},
	item: {
		width: 115,
		height: 160,
	},
	contentTitle: {
		fontSize: 12,
	},
	carouselButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center', // Align items vertically
		paddingHorizontal: 0,
		position: 'absolute',
		top: 5,
		right: 5,
		zIndex: 1,
	},
	addMore: {
		marginRight: 5,
		marginBottom: 2,
	},
	showMoreButton: {
		marginTop: 5,
		marginRight: 15,
		fontSize: 3,
	},
});
