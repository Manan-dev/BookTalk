import { useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import { React, useState, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Book from './Book.js';
import axios from 'axios';
import {BOOK_API_KEY} from '@env';

const Carousel = ({
	carouselData,
	carouselTitle,
	showMore,
	toggleShowMore,
	toggleModal,
	posts,
	titles: books,
	authorName
}) => {
	const navigation = useNavigation();
	const [booksByTitle, setBooksByTitle] = useState([]);
	const [booksByAuthor, setBooksByAuthor] = useState([]);
	
	// console.log("carousel: ", authorName)
	
	useEffect(() => {
        if (carouselData) {
            // Fetch books by titles here
            fetchBooksByTitles(carouselData);
        }
    }, [carouselData]);

	useEffect(() => {
        if (authorName) {
            // Fetch books by the author here
			// console.log(authorName)
            fetchBooksByAuthor(authorName);
        }
    }, [authorName]);

	const fetchBooksByTitles = async (titles) => {
		try {
		  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
		  let responseData = [];
	
		  for (const title of titles) {
			const options = {
			  method: 'GET',
			  url: 'https://books-api7.p.rapidapi.com/books/find/title',
			  params: { title },
			  headers: {
				'X-RapidAPI-Key': BOOK_API_KEY,
				'X-RapidAPI-Host': 'books-api7.p.rapidapi.com'
			  }
			};
	
			try {
			  const response = await axios.request(options);
			  responseData.push(response.data); // Accumulate responses
			} catch (error) {
			  console.error(error);
			}
		  }
	
		  setBooksByTitle(responseData); // Update state with all responses
		} catch (error) {
		  console.error(error);
		  setBooksByTitle([]); // Update state in case of error
		}
	};

	const fetchBooksByAuthor = async (author) => {
		try {
			const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
			let responseData = [];
			
			const options = {
				method: 'GET',
				url: 'https://books-api7.p.rapidapi.com/books/find/author',
				params: {
					fname: author.first_name,
					lname: author.last_name,
					mname: author.middle_name // Include middle_name in the params if it exists
				},
				headers: {
					'X-RapidAPI-Key': BOOK_API_KEY,
					'X-RapidAPI-Host': 'books-api7.p.rapidapi.com'
				}
			};
	
			try {
				const response = await axios.request(options);
				responseData.push(response.data); // Accumulate responses
			} catch (error) {
				console.error(error);
			}
			
			setBooksByAuthor(responseData); // Update state with all responses
		} catch (error) {
			console.error(error);
			setBooksByAuthor([]); // Update state in case of error
		}
	};		

	const handleBookPress = book => {
		const { title, author, cover, plot, rating, review } = book;
		navigation.navigate('BookDetailsScreen', { title, author, cover, rating, plot, review });
	};

	const renderItem = ({ item }) => (
		<View style={styles.item}>
			<Book
				book={item[0]}
				onPress={() => handleBookPress(item[0])} // Pass the entire book object
			/>
    	</View>
	);

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
			{posts === false && (
				<TouchableOpacity
					style={styles.addMore}
					onPress={handleModalButtonPress}>
					<Text style={{ fontSize: 25, color: '#006ee6' }}>+</Text>
				</TouchableOpacity>
			)}
		</View>
	);
	
	console.log(booksByTitle)
	return (
		<View style={styles.container}>
			<Text h4 h4Style={{ fontSize: 20, marginBottom: 5 }}>
				{carouselTitle}
			</Text>
			{books === true && (
				<>
					<FlatList
						data={showMore ? booksByTitle : booksByTitle.slice(0, 5)}
						renderItem={renderItem}
						keyExtractor={(item, index) => index.toString()}
						horizontal
						showsHorizontalScrollIndicator={false}
					/>
      			{booksByTitle.length > 5 && renderShowMoreButton()}
				</>
			)}

			{authorName === true && (
				<>
					<FlatList
						data={booksByAuthor}
						renderItem={renderItem}
						keyExtractor={(item, index) => index.toString()}
						horizontal
						showsHorizontalScrollIndicator={false}
					/>
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
