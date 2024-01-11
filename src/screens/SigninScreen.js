import { Button, Input } from '@rneui/themed';
import React, { useState } from 'react';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';

export default function SigninScreen({ navigation }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const firebase = React.useContext(FirebaseContext);
	const [_, setUser] = React.useContext(UserContext);

	handleSignin = async () => {
		setLoading(true);

		try {
			await firebase.signin(email, password);

			const uid = firebase.getCurrentUser().uid;

			const userInfo = await firebase.getUserInfo(uid);

			setUser({
				username: userInfo.username,
				email: userInfo.email,
				uid,
				profilePhotoUrl: userInfo.profilePhotoUrl,
				isLoggedIn: true,
			});
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.titleText}>BookTalk</Text>
			<View style={styles.auth}>
				<View style={styles.authContainer}>
					<Input
						placeholder="Email-address"
						autoCapitalize="none"
						autoCorrect={false}
						autoFocus={true}
						keyboardType="email-address"
						value={email}
						onChangeText={email => setEmail(email)}
					></Input>
					<Input
						placeholder="Password"
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry={true}
						value={password}
						onChangeText={password => setPassword(password)}
					></Input>
				</View>
			</View>
			{loading ? (
				<Button
					buttonStyle={styles.signinButton}
					loading
					disabled={true}
				></Button>
			) : (
				<Button buttonStyle={styles.signinButton} onPress={handleSignin}>
					Sign in
				</Button>
			)}
			<TouchableOpacity
				style={styles.signup}
				onPress={() => navigation.navigate('Signup')}
			>
				<Text>
					Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
				</Text>
			</TouchableOpacity>

			<StatusBar barStyle="default" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	titleText: {
		marginTop: 100,
		alignSelf: 'center',
		fontSize: 30,
		fontWeight: 'bold',
	},
	auth: {},
	authContainer: {},
	signup: {
		marginTop: 10,
		alignItems: 'center',
	},
	signinButton: {
		width: '80%',
		borderRadius: 10,
		alignSelf: 'center',
	},
	signupLink: {
		fontWeight: 'bold',
		color: 'rgb(67, 135, 214)',
	},
});
