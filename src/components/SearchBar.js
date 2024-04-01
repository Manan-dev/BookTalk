import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Icon } from 'react-native-elements';

const SearchBar = ({ onSearch }) => {
	const [query, setQuery] = useState('');

	const handleSeach = () => {
		// Add the search logic here
		// And pass the result back to the parent component

		// This is just to test how search query works
		console.log('Search Query:', query);
		onSearch(query);
	};

	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					flex: 1,
					borderWidth: 1,
					borderRadius: 5,
					borderColor: 'gray',
				}}
			>
				<Icon
					name="search"
					type="font-awesome"
					style={{ marginLeft: 10, marginRight: 5 }}
					onPress={handleSeach}
				/>

				<TextInput
					style={{
						flex: 1,
						height: 40,
						borderColor: 'gray',
						borderWidth: 1,
						paddingLeft: 5,
					}}
					placeholder="Search books..."
					onChangeText={text => setQuery(text)}
					value={query}
				/>
			</View>
		</View>
	);
};

export default SearchBar;
