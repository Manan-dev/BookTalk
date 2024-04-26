// SearchModal.js
import React, { useState } from 'react';
import {
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

const SearchModal = ({ visible, onClose, onSearch }) => {
	const [query, setQuery] = useState('');

	const handleSearch = () => {
		onSearch(query);
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
				{/* Display search results here */}
				{/* Example: */}
				{/* <ScrollView>
					{searchResults.map((item, index) => (
						<Text key={index}>{item.title}</Text>
					))}
				</ScrollView> */}
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
});

export default SearchModal;
