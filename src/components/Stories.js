import React from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const Stories = () => {
	const data = [
		{ id: 1, title: 'Story 1' },
		{ id: 2, title: 'Story 2' },
		{ id: 3, title: 'Story 3' },
		{ id: 4, title: 'Story 4' },
		{ id: 5, title: 'Story 5' },
		{ id: 6, title: 'Story 6' },
		{ id: 7, title: 'Story 7' },
		// Add more stories as needed
	];

	return (
		<View style={styles.container}>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{data.map(story => (
					<TouchableOpacity key={story.id} style={styles.story}>
						<Text>{story.title}</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
};

export default Stories;

const styles = StyleSheet.create({
	container: {
		height: 81,
		backgroundColor: '#fff',
		paddingBottom: 10,
		marginBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	story: {
		height: 70,
		width: 70,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: '#000',
		marginHorizontal: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
