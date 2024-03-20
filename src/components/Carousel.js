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
}) => {
	const navigation = useNavigation();
	const [booksByTitle, setBooksByTitle] = useState([]);
	
	useEffect(() => {
        if (carouselData) {
            // Fetch books by titles here
            fetchBooksByTitles(carouselData);
        }
    }, [carouselData]);


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

	const handleBookPress = book => {
		const { title, author, cover, plot, review, rating } = book;
		navigation.navigate('BookDetailsScreen', { title, author, cover, plot, review, rating });
	};

	const renderItem = ({ item }) => (
		<View style={styles.item}>
			{item.map((book, index) => (
				<Book
					key={index}
					book={book}
					onPress={() => handleBookPress(book)}
				/>
			))}
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
