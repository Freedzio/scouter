import { Packer } from 'docx';
import { Base64 } from 'js-base64';
import QueryString from 'qs';
import { Linking, ToastAndroid } from 'react-native';
import { endpoints } from '../common/fetch-google/endpoints';
import { fetchGoogle } from '../common/fetch-google/fetch-google';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const uploadFile = async (
	doc: Document,
	fileName: string,
	token: string,
	goHome: () => void
) => {
	try {
		const file = Base64.toUint8Array(await Packer.toBase64String(doc as any));

		const { id: fileId } = await fetchGoogle(endpoints.uploadFile, token, {
			method: 'POST',
			body: file,
			headers: {
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			}
		});

		await fetchGoogle(endpoints.uploadMetadata(fileId), token, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: fileName })
		});

		// filename is also storage key
		await AsyncStorage.removeItem(fileName);

		const { webViewLink } = await fetchGoogle(
			endpoints.getFileData(fileId),
			token
		);

		const { email } = await fetchGoogle(endpoints.userInfo, token);

		const query = QueryString.stringify({
			subject: `Twój draft meczu ${fileName}`,
			body: webViewLink
		});

		const emailUrl = `mailto:${email}?${query},`;

		goHome();

		Linking.openURL(emailUrl);
	} catch (e) {
		const stringifiedError = JSON.stringify(e, null, 2);
		ToastAndroid.show(stringifiedError, 10000);
		console.log(stringifiedError);
	}
};
