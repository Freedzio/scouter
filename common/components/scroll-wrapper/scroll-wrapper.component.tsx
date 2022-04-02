import React, { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { useApp } from '../../../app.context';
import { LoaderSpinner } from '../loader-spinner/loader-spinner.component';

type Props = {
	children: React.ReactNode;
	loading?: boolean;
};

export const ScrollWrapper: React.FC<PropsWithChildren<Props>> = ({
	children,
	loading
}) => {
	const { backgroundStyle } = useApp();
	return loading ? (
		<LoaderSpinner />
	) : (
		<ScrollView
			contentContainerStyle={{
				...backgroundStyle,
				paddingHorizontal: 10,
				paddingTop: 50
			}}
		>
			<View>{children}</View>
		</ScrollView>
	);
};
