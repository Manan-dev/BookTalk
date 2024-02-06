import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SearchBar from '../components/SearchBar';   // Import the SearchBar component

// Functional component for the SearchScreen
const SearchScreen = () => {

	// Define a function to handle the search action
	const handleSeach = (query) => {
		console.log('Search Query: ', query)
		// Upadate state or make API calls here
	};

	// Render the SearchScreen component
	return (
		<View style={styles.container}>

			<SearchBar onSearch={handleSeach} />

			{/* Content for the SearchScreen goes here */}
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				{/* <Text>Search Screen</Text> */}
			</View>
		</View>
	);
};

export default SearchScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
