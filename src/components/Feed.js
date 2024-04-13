import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';
import Post from './Post';

const Feed = () => {
	const [selectedPost, setSelectedPost] = useState(null);
	const [postLikeState, setPostLikeState] = useState({});
	const [user, _] = React.useContext(UserContext);
	const firebase = React.useContext(FirebaseContext);
	const [posts, setPosts] = useState([]);
	const [comments, setComments] = useState({});
	const [newComment, setNewComment] = useState('');
	const [commentModalVisible, setCommentModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				let fetchedPosts = await firebase.getAllPosts();

				// TODO: REMOVE THIS WHEN PAGINATION IS IMPLEMENTED
				fetchedPosts = fetchedPosts.slice(0, 6);

				setPosts(fetchedPosts);
				const commentsObj = {};
				fetchedPosts.forEach(post => {
					commentsObj[post.id] = post.comments || [];
				});
				setComments(commentsObj);
				// Set postLikeState based on isLikedByCurrentUser
				const likeState = fetchedPosts.reduce((state, post) => {
					state[post.id] = post.isLikedByCurrentUser;
					return state;
				}, {});
				setPostLikeState(likeState);
			} catch (error) {
				console.error('Error fetching posts:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchPosts();
	}, []);

	const toggleLike = async (postId, postCreatorUserId) => {
		const isLiked = postLikeState[postId];
		setPostLikeState(prevState => ({
			...prevState,
			[postId]: !isLiked || false,
		}));

		if (isLiked) {
			// If the post is currently liked, remove the like entry from the database
			await firebase.removeLikedPostFromFirestore(
				postId,
				postCreatorUserId,
				user.uid
			);
		} else {
			// If the post is currently unliked, add the like entry to the database
			await firebase.addLikedPostToFirestore(
				postId,
				postCreatorUserId,
				user.uid
			);
		}
	};

	const addComment = (postId, newComment, postCreatorUserId) => {
		if (!newComment) return;
		const currentUserComment = {
			commentingUsername: user.username,
			commentingUserPhotoURL: user.profilePhotoUrl,
			commentText: newComment,
		};
		setComments(prevComments => ({
			...prevComments,
			[postId]: [...(prevComments[postId] || []), currentUserComment],
		}));
		firebase.addCommentToFirestore(
			postId,
			postCreatorUserId,
			user.uid,
			newComment
		);
	};

	const addCommentModal = async item => {
		setSelectedPost(item);
		setCommentModalVisible(true);
	};

	const hideCommentModal = () => {
		setCommentModalVisible(false);
	};

	const renderItem = ({ item }) => (
		<Post
			item={item}
			postCreatorUserId={item.userId}
			toggleLike={postId => toggleLike(postId, item.userId)}
			addCommentModal={addCommentModal}
			commentModalVisible={commentModalVisible}
			hideCommentModal={hideCommentModal}
			selectedPost={selectedPost}
			newComment={newComment}
			setNewComment={setNewComment}
			addComment={(postId, newComment) =>
				addComment(postId, newComment, item.userId)
			}
			comments={comments[item.id]}
			user={user}
			postLikeState={postLikeState}
		/>
	);

	const renderDropdownOptions = () => (
		<View style={styles.dropdownContainer}>
			<TouchableOpacity
				style={styles.dropdownOption}
				onPress={() => console.log('Share clicked')}
			>
				<Text>Share</Text>
			</TouchableOpacity>
		</View>
	);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#E9446A" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={posts}
				keyExtractor={item => item.id}
				renderItem={renderItem}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	dropdownContainer: {
		backgroundColor: 'white',
		padding: 8,
		borderRadius: 8,
	},
	dropdownOption: {
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Feed;
