import React from 'react';
import { View, Text } from 'react-native';
import { useHeight } from '../../common/hooks/use-height.hook';
type Props = {};

export const UnauthorizedView: React.FC<Props> = () => {
	const height = useHeight();
	return (
		<View style={{ height }}>
			<Text>Sorry nie możesz</Text>
		</View>
	);
};
