import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

export default function CreatePostScreen() {
	const [postText, setPostText] = useState('');
	const [media, setMedia] = useState(null);
	const navigation = useNavigation();

	const handlePost = () => {
		// Handle posting logic here
		console.log('Post:', postText);
		console.log('Media:', media);
		setPostText('');
		setMedia(null);
		// navigate to previous screen
		navigation.goBack();
	};

	const handleAddMedia = () => {
		// Handle adding media logic here
		console.log('Add Media');
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.headerButton}
					onPress={() => navigation.goBack()}
				>
					<Text style={styles.headerButtonText}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.headerButton} onPress={handlePost}>
					<Text style={styles.headerButtonText}>Post</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.inputContainer}>
				<View style={styles.inputBox}>
					<TextInput
						style={styles.input}
						placeholder="Write your post here..."
						onChangeText={text => setPostText(text)}
						value={postText}
						multiline
					/>
					<TouchableOpacity style={styles.mediaButton} onPress={handleAddMedia}>
						<MaterialIcons name="add-a-photo" size={24} color="white" />
					</TouchableOpacity>
				</View>
				{media && (
					<ScrollView horizontal>
						<Image source={{ uri: media }} style={styles.mediaPreview} />
					</ScrollView>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: 50,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		marginBottom: 10,
	},
	headerButton: {
		padding: 10,
		borderRadius: 20,
	},
	headerButtonText: {
		fontSize: 16,
		color: '#fff',
		backgroundColor: '#E9446A',
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	inputContainer: {
		paddingHorizontal: 20,
		flex: 1,
	},
	inputBox: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 10,
		padding: 10,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		height: 300,
	},
	input: {
		fontSize: 18,
	},
	mediaButton: {
		backgroundColor: '#E9446A',
		padding: 10,
		borderRadius: 10,
		marginBottom: 10,
		position: 'absolute',
		bottom: 0,
		left: 10,
	},
	buttonText: {
		color: 'white',
		marginLeft: 10,
	},
	mediaPreview: {
		width: 100,
		height: 100,
		borderRadius: 10,
		marginRight: 10,
	},
});
