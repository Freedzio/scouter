import { Dimensions } from 'react-native';

export const useHeight = () => {
	return Dimensions.get('screen').height;
};
