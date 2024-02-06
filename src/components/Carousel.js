import { Text } from '@rneui/themed';
import React from 'react';
import { FlatList, StyleSheet, View, Image, TouchableOpacity } from 'react-native';

const Carousel = ({ carouselData, title }) => {
	const renderItem = ({ item }) => (
		<View style={styles.item}>
			{/* <Text style={styles.contentTitle}>{item.content}</Text> */}
			<TouchableOpacity><Image source={{ url: item.imageURL }} style={{width:75, height:120}}/></TouchableOpacity>
		</View>
	);
	return (
		<View>
			<Text h4 h4Style={{ fontSize: 20, marginBottom: 5 }}>
				{title}
			</Text>
			<View style={styles.container}>
				<FlatList
					data={carouselData}
					renderItem={renderItem}
					keyExtractor={item => item.id}
					horizontal
					showsHorizontalScrollIndicator={false}
				/>
			</View>
		</View>
	);
};

export default Carousel;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 140,
		// backgroundColor: 'rgba(0,0,0,0.1)',
		paddingLeft: 5,
		paddingTop: 5,
		paddingBottom: 5,
		marginBottom: 10,
	},
	item: {
		maxWidth: 70,
		minWidth: 70,
		// backgroundColor: '#f9c2ff',
		padding: 7,
		marginRight: 10,
	},
	contentTitle: {
		fontSize: 12,
	},
});
