import { Button, Input } from '@rneui/themed';
import React, { useContext, useState } from 'react';
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

export default function SignupScreen({ navigation }) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const firebase = useContext(FirebaseContext);
	const [_, setUser] = useContext(UserContext);

	const handleSignup = async () => {
		setLoading(true);
		const user = { username, email, password };

		// alert user if any of the fields are empty
		for (const key in user) {
			if (user[key] === '') {
				alert(`Please enter your ${key}`);
				setLoading(false);
				return;
			}
		}
		try {
			const createdUser = await firebase.createUser(user);

			if (createdUser.error) {
				alert(createdUser.error.message);
				return;
			}
			setUser({ ...createdUser, isLoggedIn: true });
		} catch (error) {
			console.log('Error @handleSignup: ', error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.titleText}>Sign Up!</Text>
			<View style={styles.auth}>
				<View style={styles.authContainer}>
					<Input
						placeholder="Username"
						autoCapitalize="none"
						autoCorrect={false}
						autoFocus={true}
						value={username}
						onChangeText={name => setUsername(name)}
					></Input>
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
					buttonStyle={styles.signupButton}
					loading
					disabled={true}
				></Button>
			) : (
				<Button buttonStyle={styles.signupButton} onPress={handleSignup}>
					Sign up
				</Button>
			)}
			<TouchableOpacity
				style={styles.signup}
				onPress={() => navigation.navigate('Signin')}
			>
				<Text>
					Already have an account?{' '}
					<Text style={styles.signinLink}>Sign in</Text>
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
	signupButton: {
		width: '80%',
		borderRadius: 10,
		alignSelf: 'center',
	},
	signinLink: {
		fontWeight: 'bold',
		color: 'rgb(67, 135, 214)',
	},
});
