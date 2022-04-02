import { File, Packer } from 'docx';
import { Base64 } from 'js-base64';
import QueryString from 'qs';
import { Linking, ToastAndroid } from 'react-native';
import { endpoints } from '../fetch-google/endpoints';
import { fetchGoogle } from '../fetch-google/fetch-google';

export const uploadFile = async (
	doc: File,
	fileName: string,
	token: string
) => {
	try {
		ToastAndroid.show('Tworzę plik...', 5000);
		const file = Base64.toUint8Array(await Packer.toBase64String(doc));

		ToastAndroid.show('Uploaduję plik...', 5000);
		const { id: fileId } = await fetchGoogle(endpoints.uploadFile, token, {
			method: 'POST',
			body: file,
			headers: {
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			}
		});

		ToastAndroid.show('Wysyłam metadane...', 5000);
		await fetchGoogle(endpoints.uploadMetadata(fileId), token, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: fileName })
		});

		ToastAndroid.show('Pobieram dane pliku...', 5000);
		const { webViewLink } = await fetchGoogle(
			endpoints.getFileData(fileId),
			token
		);

		ToastAndroid.show('Pobieran dane usera...', 5000);
		const { email } = await fetchGoogle(endpoints.userInfo, token);

		const query = QueryString.stringify({
			subject: `Twój draft meczu ${fileName}`,
			body: webViewLink
		});

		const emailUrl = `mailto:${email}?${query},`;

		Linking.openURL(emailUrl);
	} catch (e) {
		const stringifiedError = JSON.stringify(e);
		ToastAndroid.show(stringifiedError, 100000);
		console.log(stringifiedError);
	}
};
