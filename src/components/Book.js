// BookComponent.js
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const BookComponent = ({ book, onPress }) => {
	return (
		<TouchableOpacity style={styles.container} onPress={() => onPress(book)}>
			<Image source={{ uri: book.cover }} style={styles.coverImage} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 5,
		borderRadius: 8,
		backgroundColor: '#fff',
		elevation: 4, // For Android shadow
		shadowColor: '#000', // For iOS shadow
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	coverImage: {
		width: '100%',
		height: 160,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
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
