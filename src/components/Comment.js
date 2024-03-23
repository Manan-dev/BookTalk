import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

const Comment = ({ comments, currentUser }) => {
	const renderCommentItem = ({ item }) => (
		<View style={styles.comment}>
			<Image
				source={{
					uri: item.commentingUserPhotoURL || 'https://via.placeholder.com/150',
				}}
				style={styles.commentsProfilePic}
			/>
			<View style={styles.commentContent}>
				<Text style={styles.commentUsername}>{item.commentingUsername}:</Text>
				<Text style={styles.commentText}> {item.commentText}</Text>
			</View>
		</View>
	);

	return (
		<FlatList
			data={comments}
			renderItem={renderCommentItem}
			keyExtractor={(item, index) => index.toString()}
			style={styles.container}
		/>
	);
};

const styles = StyleSheet.create({
	comment: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		borderWidth: 1,
		borderRadius: 8,
		padding: 4,
	},
	commentUsername: {
		fontWeight: 'bold',
	},
	commentsProfilePic: {
		width: 30,
		height: 30,
		borderRadius: 15,
		marginRight: 8,
	},
	commentContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		maxWidth: '80%',
	},
	commentText: {
		flex: 1,
		flexWrap: 'wrap',
	},
});

export default Comment;
