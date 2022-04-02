import React from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useHeight } from '../common/hooks/use-height.hook';

type Props = {};

export const VeryfyingUserView: React.FC<Props> = () => {
	const height = useHeight();
	return (
		<View style={{ height }}>
			<Text style={{ fontSize: 40, textAlign: 'center', marginVertical: 30 }}>
				Sprawdzam profil skauta...
			</Text>
			<ActivityIndicator size={300} animating={true} />
		</View>
	);
};
