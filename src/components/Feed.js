import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Modal from 'react-native-modal';
import { UserContext } from '../context/UserContext';

const CommentSection = ({ comments, currentUser }) => {
	return (
		<View>
			{comments.map((comment, index) => (
				<View key={index} style={styles.comment}>
					<Image
						source={{
							uri:
								currentUser.profilePhotoUrl ||
								'https://via.placeholder.com/150',
						}}
						style={styles.commentsProfilePic}
					/>
					<View style={styles.commentContent}>
						<Text style={styles.currentUser}>{currentUser.username}: </Text>
						<Text key={index} style={styles.commentText}>
							{comment}
						</Text>
					</View>
				</View>
			))}
		</View>
	);
};

const Feed = () => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	const [postLikeState, setPostLikeState] = useState({}); // Track like state for each post
	const [user, _] = React.useContext(UserContext);

	const ellipsisClicked = item => {
		setSelectedPost(item);
		setModalVisible(true);
	};

	const hideModal = () => {
		setModalVisible(false);
	};

	const toggleLike = postId => {
		setPostLikeState(prevState => ({
			...prevState,
			[postId]: !prevState[postId] || false,
		}));
	};

	const renderDropdownOptions = () => {
		// Customize your dropdown options
		return (
			<View style={styles.dropdownContainer}>
				{/* <Text>
          {selectedPost?.username}
        </Text> */}
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Unfollow clicked')}
				>
					<Text>Unfollow</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.dropdownOption}
					onPress={() => console.log('Share clicked')}
				>
					<Text>Share</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const data = [
		{
			id: '1',
			username: 'user1',
			postImage: require('../../assets/favicon.png'),
			caption: 'This is the first post.',
		},
		{
			id: '2',
			username: 'user2',
			postImage: require('../../assets/favicon.png'),
			caption: 'This is the second post.',
		},
		{
			id: '3',
			username: 'user3',
			postImage: require('../../assets/favicon.png'),
			caption: 'This is the third post.',
		},
		// Add more posts as needed
	];

	const [comments, setComments] = useState({});
	const [newComment, setNewComment] = useState('');
	const [commentModalVisible, setCommentModalVisible] = useState(false);

	const addComment = (postId, newComment) => {
		// check comment is not empty
		if (!newComment) return;
		setComments(prevComments => ({
			...prevComments,
			[postId]: [...(prevComments[postId] || []), newComment],
		}));
	};

	const addCommentModal = item => {
		setCommentModalVisible(true);
	};

	const renderItem = ({ item }) => (
		<View style={styles.postContainer}>
			<View style={styles.topContainer}>
				<View style={styles.userInfoContainer}>
					<Image
						source={require('../../assets/favicon.png')}
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
			<Image source={item.postImage} style={styles.postImage} />
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
				isVisible={commentModalVisible}
				onBackdropPress={() => setCommentModalVisible(false)}
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
					<CommentSection
						comments={comments[item.id] || []}
						currentUser={user}
					/>
				</View>
			</Modal>
		</View>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={data}
				keyExtractor={item => item.id}
				renderItem={renderItem}
			/>
			<Modal isVisible={isModalVisible} onBackdropPress={hideModal}>
				{renderDropdownOptions()}
			</Modal>
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
		marginVertical: 8,
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
	dropdownContainer: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 8,
	},
	dropdownOption: {
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	addCommentButton: {
		marginTop: 8,
		backgroundColor: '#ddd',
		width: '80%',
		padding: 8,
		borderRadius: 8,
	},
	commentModalContainer: {
		width: '100%',
		backgroundColor: '#fff',
		padding: 16,
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
		// blue color
		backgroundColor: '#1E90FF',
	},
	comment: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		borderWidth: 1,
		borderRadius: 8,
		padding: 4,
	},
	currentUser: {
		fontWeight: 'bold',
	},
	commentsProfilePic: {
		width: 30,
		height: 30,
		borderRadius: 30,
		borderColor: '#000',
		borderWidth: 1,
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
