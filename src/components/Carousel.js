import { useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Book from './Book.js';

const Carousel = ({
	carouselData,
	title,
	showMore,
	toggleShowMore,
	toggleModal,
	posts,
}) => {
	const navigation = useNavigation();
	const handleBookPress = book => {
		navigation.navigate('BookDetailsScreen', { book });
	};

	const renderItem = ({ item }) => (
		<View style={styles.item}>
			<Book book={item} onPress={handleBookPress} />
		</View>
	);

	const handleModalButtonPress = () => {
		toggleModal(); // Call the toggleModal function passed down from the parent component
	};

	const renderShowMoreButton = () => (
		<View style={styles.carouselButtonContainer}>
			<TouchableOpacity onPress={toggleShowMore} style={styles.showMoreButton}>
				<Text style={{ color: '#006ee6' }}>
					{showMore ? 'Show Less' : 'Show More >'}
				</Text>
			</TouchableOpacity>
			{posts === false && (
				<TouchableOpacity
					style={styles.addMore}
					onPress={handleModalButtonPress}
				>
					<Text style={{ fontSize: 25, color: '#006ee6' }}>+</Text>
				</TouchableOpacity>
			)}
		</View>
	);

	return (
		<View style={styles.container}>
			<Text h4 h4Style={{ fontSize: 20, marginBottom: 5 }}>
				{title}
			</Text>

			<FlatList
				data={carouselData.slice(0, showMore ? carouselData.length : 5)}
				renderItem={renderItem}
				keyExtractor={item => item.id}
				horizontal
				showsHorizontalScrollIndicator={false}
			/>
			{carouselData.length > 5 && renderShowMoreButton()}
		</View>
	);
};

export default Carousel;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 170,
		paddingLeft: 5,
		paddingTop: 5,
		paddingBottom: 5,
		marginBottom: 10,
		position: 'relative',
	},
	item: {
		maxWidth: 70,
		height: '100%',
		minWidth: 70,
		padding: 7,
		marginRight: 10,
	},
	contentTitle: {
		fontSize: 12,
	},
	carouselButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center', // Align items vertically
		paddingHorizontal: 0,
		position: 'absolute',
		top: 5,
		right: 5,
		zIndex: 1,
	},
	addMore: {
		marginRight: 5,
		marginBottom: 2,
	},
	showMoreButton: {
		marginTop: 5,
		marginRight: 15,
		fontSize: 3,
	},
});
