import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Comment = ({ comments, currentUser }) => {
	return (
		<View>
			{comments &&
				comments.map((comment, index) => (
					<View key={index} style={styles.comment}>
						<Image
							source={{
								uri:
									comment.commentingUserPhotoURL ||
									'https://via.placeholder.com/150',
							}}
							style={styles.commentsProfilePic}
						/>
						<View style={styles.commentContent}>
							<Text style={styles.commentUsername}>
								{comment.commentingUsername}:
							</Text>
							<Text style={styles.commentText}> {comment.commentText}</Text>
						</View>
					</View>
				))}
		</View>
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
