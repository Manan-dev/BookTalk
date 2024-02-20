import { Kings_400Regular, useFonts } from '@expo-google-fonts/kings';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@rneui/themed';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

const CustomHeader = () => {
	const navigation = useNavigation();
	let [fontsLoaded] = useFonts({
		Kings_400Regular,
	});

	if (!fontsLoaded) {
		return null;
	}
	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity
				style={styles.logoButton}
				onPress={() => navigation.navigate('Home')}
			>
				<Text h3 h3Style={styles.logoText}>
					BookTalk
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default CustomHeader;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
	},
	logoText: {
		fontSize: 30,
		color: '#E9446A',
		fontFamily: 'Kings_400Regular',
		marginLeft: 15,
		marginTop: 10,
	},
	logoButton: {
		width: '40%',
	},
});
