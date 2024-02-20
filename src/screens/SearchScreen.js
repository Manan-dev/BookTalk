import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text } from 'react-native';
import SearchBar from '../components/SearchBar'; // Import the SearchBar component
import axios from 'axios';
import {BOOK_API_KEY} from '@env';

//  Functional component for the SearchScreen
const SearchScreen = () => {
	const [searchResults, setSearchResults] = useState([]);
	const [selectedBook, setSelectedBook] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState(' ');

	// Define a function to handle the search action   
	const handleSearch = async (query) => {

		// Update the searchQuery state
		setSearchQuery(query.trim());

		// If the query is empty, fetch random books
		if (!query.trim()) {
			fetchRandomBooks();
			return;
		}

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

	// Fetch random books when the component mounts
	const fetchRandomBooks = async () => {
		try {

			// Define the number of random books you want to fetch
			const numberOfBooks = 9;

			// Make a GET request to the Books-API to get random books
			const requests = Array.from({ length: numberOfBooks }, async (_,index) => {
				return axios.get('https://books-api7.p.rapidapi.com/books/get/random/', {
					headers: {
						'X-RapidAPI-Key': BOOK_API_KEY,
						'X-RapidAPI-Host': 'books-api7.p.rapidapi.com',
					},
				});
			});
			
			// Wait for all requests to complete
			const responses = await Promise.all(requests);

			// Extract the book data from each response 
			const booksArray = responses.map(response =>response.data);

			// Update the state with the random books
			setSearchResults(booksArray);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}; 

	// Fetch random books when the compnent mounts
	useEffect(() => {
		// Call the fetchRandomBooks function
		fetchRandomBooks();
	}, []);

	// Render the SearchScreen component
	return (
		<View style={styles.container}>

			{/* SearchBar compnent with handleSearch as the callback */}
			<SearchBar onSearch={handleSearch} />

			{selectedBook && (
				<View>
				<Text>{selectedBook.title}</Text>
				<Image source={{ uri: selectedBook.cover }} style={styles.selectedImage} />
				</View>
			)}

			{/* Display search recommendations in a grid */}
			<FlatList
				data={searchResults}
				numColumns={3}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<TouchableOpacity>
						<Image source={{ uri: item.cover }} style={styles.image} />
					</TouchableOpacity>
				)}
			/>
		</View>
	);
};


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		width: 120,
		height: 200,
		margin: 4,
		borderRadius: 4,
	},
	selectedImage: {
		width: 120,
		height: 200,
		margin: 4,
		borderRadius: 4,
	},
});

export default SearchScreen;

