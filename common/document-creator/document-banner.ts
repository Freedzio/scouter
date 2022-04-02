import { Paragraph, ImageRun } from 'docx';
import { Base64 } from 'js-base64';
import { banner } from '../../banner';

export const documentBanner = new Paragraph({
	children: [
		new ImageRun({
			data: Base64.toUint8Array(banner),
			transformation: {
				width: 600,
				height: 200
			}
		})
	]
});
