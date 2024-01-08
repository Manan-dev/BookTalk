import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

const Feed = () => {
	const data = [
		{
			id: '1',
			username: 'user1',
			postImage: require('../../assets/favicon.png'), // Replace with the actual image URL
			caption: 'This is the first post.',
		},
		{
			id: '2',
			username: 'user2',
			postImage: require('../../assets/favicon.png'), // Replace with the actual image URL
			caption: 'This is the second post.',
		},
		{
			id: '3',
			username: 'user3',
			postImage: require('../../assets/favicon.png'), // Replace with the actual image URL
			caption: 'This is the third post.',
		},
		// Add more posts as needed
	];

	const renderItem = ({ item }) => (
		<View style={styles.postContainer}>
			<View style={styles.userInfoContainer}>
				<Image
					source={require('../../assets/favicon.png')}
					style={styles.profilePic}
				/>
				<Text style={styles.username}>{item.username}</Text>
			</View>
			<Image source={item.postImage} style={styles.postImage} />
			<Text style={styles.caption}>{item.caption}</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={data}
				keyExtractor={item => item.id}
				renderItem={renderItem}
			/>
		</View>
	);
};

export default Feed;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	postContainer: {
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		padding: 8,
	},
	username: {
		fontWeight: 'bold',
	},
	postImage: {
		width: '100%',
		height: 300,
		borderRadius: 8,
		resizeMode: 'contain',
	},
	caption: {
		marginTop: 8,
	},
	profilePic: {
		width: 50,
		height: 50,
		marginEnd: 8,
		borderRadius: 50,
		borderColor: '#000',
		borderWidth: 1,
	},
	userInfoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
});
