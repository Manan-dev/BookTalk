// BookComponent.js
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

const BookComponent = ({ book, onPress }) => {
	return (
		<TouchableOpacity style={styles.container} onPress={() => onPress(book)}>
			<Image source={{ uri: book.coverImage }} style={styles.coverImage} />
			<Text style={styles.title}>{book.title}</Text>
			<Text style={styles.author}>{book.author}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 10,
		borderRadius: 8,
		backgroundColor: '#fff',
		elevation: 4, // For Android shadow
		shadowColor: '#000', // For iOS shadow
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	coverImage: {
		width: 150,
		height: 200,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		margin: 5,
	},
	author: {
		fontSize: 14,
		marginHorizontal: 5,
		marginBottom: 10,
	},
});

export default BookComponent;
