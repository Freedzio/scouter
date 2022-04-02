import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Alert, BackHandler, Dimensions, Text, View } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';

type Props = {};

export const LoaderSpinner: React.FC<Props> = () => {
	const { height } = Dimensions.get('window');

	const navigation = useNavigation();

	useEffect(() => {
		navigation.addListener('beforeRemove', (e) => {
			e.preventDefault();

			Alert.alert('Poczekaj', 'Trwa tworzenie i zapisywanie dokumentu', [
				{
					text: 'OK',
					style: 'default',
					onPress: () => {}
				}
			]);
		});
	}, [navigation]);

	return (
		<View style={{ height }}>
			<Text style={{ fontSize: 40, textAlign: 'center', marginVertical: 30 }}>
				Zapisuję...
			</Text>
			<ActivityIndicator size={300} animating={true} />
		</View>
	);
};
