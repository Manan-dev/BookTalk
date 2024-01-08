import React from 'react';
import { StyleSheet, View } from 'react-native';
import Feed from '../components/Feed';
import Stories from '../components/Stories';

export default function Home() {
	return (
		<View style={styles.container}>
			<Stories />
			<Feed />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 10,
		backgroundColor: '#fff',
	},
});
