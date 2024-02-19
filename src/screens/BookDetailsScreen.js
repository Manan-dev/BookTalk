import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const BookDetailsScreen = ({ route }) => {
	const { book } = route.params;

	return (
		<View style={styles.container}>
			<Image source={{ uri: book.coverImage }} style={styles.coverImage} />
			<Text style={styles.title}>{book.title}</Text>
			<Text style={styles.author}>{book.author}</Text>
			<Text style={styles.description}>{book.description}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	coverImage: {
		width: 200,
		height: 300,
		marginBottom: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	author: {
		fontSize: 18,
		marginBottom: 5,
	},
	description: {
		fontSize: 16,
		textAlign: 'center',
		paddingHorizontal: 20,
	},
});

export default BookDetailsScreen;
