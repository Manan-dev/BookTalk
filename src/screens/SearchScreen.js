import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import SearchBar from '../components/SearchBar';   // Import the SearchBar component
import searchRecommendation from '../data/searchRecommendation.json' // Import the data

// Functional component for the SearchScreen
const SearchScreen = () => {

	const [searchResults, setSearchResults] = useState([])

	// Define a function to handle the search action
	const handleSeach = (query) => {
		console.log('Search Query: ', query)
		// Upadate state or make API calls here
	};

	// Render the SearchScreen component
	return (
		<View style={styles.container}>

			<SearchBar onSearch={handleSeach} />

			{/* Display search recommendations in a grid */}

			<FlatList
				data={searchRecommendation}
				numColumns={3}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => console.log('Item clicked:', item.id)}>
						<Image source={{ uri: item.content }} style={styles.image}/>
					</TouchableOpacity>
				)}
			/>

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

	recommendedList: {
		marginTop: 20,
	},

	recommendedItem: {
		flex: 1,
		alignItems: 'center',
		margin: 10,
		padding: 10,
		backgroundColor: '#e0e0e0',
		borderRadius: 8,
	},
	image: {
		width: 120,
		height: 200,
		margin: 4,
		borderRadius: 4,
	},
});
