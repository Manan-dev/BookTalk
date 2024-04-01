import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Modal from 'react-native-modal';
import Swiper from 'react-native-swiper';
import Comment from './Comment';

const Post = ({
	item,
	toggleLike,
	ellipsisClicked,
	addCommentModal,
	commentModalVisible,
	hideCommentModal,
	selectedPost,
	newComment,
	setNewComment,
	addComment,
	comments,
	user,
	postLikeState,
}) => {
	const shouldShowArrows = Boolean(item.imageURL && item.book);

	return (
		<View style={styles.postContainer}>
			<View style={styles.topContainer}>
				<View style={styles.userInfoContainer}>
					<Image
						source={{ uri: item.profilePhotoUrl }}
						style={styles.profilePic}
					/>
					<Text style={styles.username}>{item.username}</Text>
				</View>
				<View>
					<TouchableOpacity onPress={() => ellipsisClicked(item)}>
						<Ionicons name="ellipsis-horizontal" size={24} color="black" />
					</TouchableOpacity>
				</View>
			</View>

			<Swiper
				style={styles.swiperContainer}
				showsButtons={shouldShowArrows}
				loop
				showsPagination={shouldShowArrows}
				paginationStyle={{ bottom: -20 }}
				prevButton={
					<Ionicons
						name="chevron-back-outline"
						size={24}
						color="#FFF"
						style={styles.controlButton}
					/>
				}
				nextButton={
					<Ionicons
						name="chevron-forward-outline"
						size={24}
						color="#FFF"
						style={styles.controlButton}
					/>
				}
			>
				{item.imageURL && (
					<View style={styles.slide}>
						<Image source={{ uri: item.imageURL }} style={styles.image} />
					</View>
				)}
				{item.book && (
					<View style={styles.slide}>
						<Image source={{ uri: item.book }} style={styles.image} />
					</View>
				)}
			</Swiper>

			<View style={styles.heartButton}>
				<TouchableOpacity onPress={() => toggleLike(item.id)}>
					{postLikeState[item.id] ? (
						<Ionicons name="heart" size={32} color="red" />
					) : (
						<Ionicons name="heart-outline" size={32} color="black" />
					)}
				</TouchableOpacity>
			</View>

			<Text style={styles.caption}>{item.caption}</Text>

			<TouchableOpacity
				style={styles.addCommentButton}
				onPress={() => addCommentModal(item)}
			>
				<Text>Add a comment...</Text>
			</TouchableOpacity>

			<Modal
				isVisible={commentModalVisible && selectedPost?.id === item.id}
				onBackdropPress={hideCommentModal}
			>
				<View style={styles.commentModalContainer}>
					<View style={styles.commentInputContainer}>
						<TextInput
							style={styles.commentInput}
							placeholder="Add a comment..."
							onChangeText={text => setNewComment(text)}
							value={newComment}
						/>
						<TouchableOpacity
							style={styles.commentButton}
							onPress={() => {
								addComment(item.id, newComment);
								setNewComment('');
							}}
						>
							<Text>Post</Text>
						</TouchableOpacity>
					</View>
					<Comment comments={comments} currentUser={user} />
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	postContainer: {
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		padding: 8,
	},
	username: {
		fontWeight: 'bold',
	},
	swiperContainer: {
		height: 270,
	},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	controlButton: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		borderRadius: 16,
		padding: 8,
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	caption: {
		marginVertical: 10,
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
	topContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	heartButton: {
		position: 'absolute',
		bottom: 10,
		right: 20,
	},
	addCommentButton: {
		marginTop: 8,
		backgroundColor: '#ddd',
		width: '80%',
		padding: 8,
		borderRadius: 8,
	},
	commentModalContainer: {
		alignSelf: 'center',
		width: '110%',
		backgroundColor: '#fff',
		padding: 16,
		marginTop: 275,
		marginBottom: 80,
	},
	commentInputContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#fff',
		marginBottom: 8,
	},
	commentInput: {
		borderWidth: 1,
		width: '80%',
		padding: 8,
	},
	commentButton: {
		borderWidth: 1,
		padding: 8,
		marginLeft: 8,
		backgroundColor: '#1E90FF',
	},
});

export default Post;
