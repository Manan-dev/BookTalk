import { GOOGLE_BOOKS_API_KEY } from '@env';
import axios from 'axios';
import React, { useState } from 'react';
import {
	Image,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

const SearchModal = ({ visible, onClose, onBookSelect }) => {
	const [query, setQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	const handleSearch = async () => {
		try {
			const response = await axios.get(
				'https://www.googleapis.com/books/v1/volumes',
				{
					params: {
						q: query.trim(),
						key: GOOGLE_BOOKS_API_KEY,
						maxResults: 9,
					},
				}
			);
			const items = response.data.items || [];
			const results = items.map(item => ({
				id: item.id,
				title: item.volumeInfo.title,
				authors: item.volumeInfo.authors
					? item.volumeInfo.authors.join(', ')
					: 'Unknown Author',
				thumbnail: item.volumeInfo.imageLinks
					? item.volumeInfo.imageLinks.thumbnail
					: null,
			}));
			setSearchResults(results);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	return (
		<Modal visible={visible} animationType="slide" onRequestClose={onClose}>
			<View style={styles.container}>
				<View style={styles.header}>
					<TextInput
						style={styles.input}
						placeholder="Search..."
						value={query}
						onChangeText={setQuery}
					/>
					<TouchableOpacity onPress={handleSearch}>
						<Text style={styles.searchButton}>Search</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={onClose}>
						<Text style={styles.closeButton}>Close</Text>
					</TouchableOpacity>
				</View>
				<ScrollView contentContainerStyle={styles.book}>
					{searchResults.map(book => (
						<TouchableOpacity key={book.id} onPress={() => onBookSelect(book)}>
							<View style={styles.bookItem}>
								<Image
									source={{ uri: book.thumbnail }}
									style={styles.bookThumbnail}
								/>
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 20,
		marginTop: 50,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	input: {
		borderRadius: 10,
		marginRight: 10,
		flex: 1,
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		paddingLeft: 5,
	},
	searchButton: {
		backgroundColor: '#E9446A',
		color: '#fff',
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 10,
	},
	closeButton: {
		color: '#E9446A',
		marginLeft: 10,
	},
	book: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row',
		gap: 10,
	},
	bookItem: {
		width: 110,
		height: 200,
	},
	bookThumbnail: {
		width: 110,
		height: 200,
		borderRadius: 10,
		objectFit: 'fill',
	},
});

export default SearchModal;
