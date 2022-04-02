import AsyncStorage from '@react-native-async-storage/async-storage';
import { DraftData } from '../common/models/draft-types.type';
import { getDraftKey } from '../common/storage/get-draft-key';

export const saveDraft = async (data: DraftData) => {
	const key = getDraftKey(data);
	await AsyncStorage.setItem(key, JSON.stringify(data));
};
