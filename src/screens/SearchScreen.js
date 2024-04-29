import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text } from 'react-native';
import SearchBar from '../components/SearchBar'; // Import the SearchBar component
import axios from 'axios';
import {BOOK_API_KEY} from '@env';
import { useNavigation } from '@react-navigation/native';

// Functional component for the SearchScreen
const SearchScreen = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
	const navigation = useNavigation();

    // Define a function to handle the search action
    const handleSearch = async (query) => {
        // Update the searchQuery state
        setSearchQuery(query.trim());

        // If the query is empty, fetch random books
        if (!query.trim()) {
            fetchRandomBooks();
            return;
        }

        // Make API call to Google Books API
        try {
        	   const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: {
                    q: query,
					key: BOOK_API_KEY,
                },
            });

            // Update the state with the search results
            setSearchResults(response.data.items || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch random books when the component mounts
    const fetchRandomBooks = async () => {
        try {
            // Define the number of random books you want to fetch
            const numberOfBooks = 12;

            const genres = ['fiction', 'fantasy', 'mystery', 'romance', 'thriller', 'science fiction', 'horror', 'non-fiction', 'biography'];

            const randomGenre = genres[Math.floor(Math.random() * genres.length)];

            // Make a GET request to the Google Books API to get random books
            const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
                params: {
                    q: `subject:${randomGenre}`, // You can adjust this query to get random books
                    maxResults: numberOfBooks,
					key: BOOK_API_KEY, 
                },
            });  

            // Update the state with the random books
            setSearchResults(response.data.items || []);

            // Shuffle the genres array to get a mix of genres
            const shuffledGenres = genres.sort(() => Math.random() - 0.5);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch random books when the component mounts
    useEffect(() => {
        // Call the fetchRandomBooks function
        fetchRandomBooks();
    }, []);

	const handleBookPress = book => {
		const { title, author, cover, plot, review, rating } = book;
		navigation.navigate('BookDetailsScreen', { title, author, cover, plot, review, rating });
	};

    // Render the SearchScreen component
    return (
        <View style={styles.container}>
            {/* SearchBar component with handleSearch as the callback */}
            <SearchBar onSearch={handleSearch} />

            {/* Display search results in a grid */}
            <FlatList
                data={searchResults}
                numColumns={3}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleBookPress(item)}>
                        <Image 
							source={{ uri: item.volumeInfo.imageLinks?.thumbnail }} 
							style={styles.image} 
							resizeMode="contain"
						/>
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

