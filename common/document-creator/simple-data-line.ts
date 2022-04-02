import { Paragraph, TextRun } from 'docx';
import { font, fontSize, marginSmall } from './constants';

export const reportDataLine = (
	label: string,
	value: string,
	biggerBottomMargin?: boolean
) =>
	new Paragraph({
		spacing: {
			after: biggerBottomMargin ? marginSmall : 0
		},
		children: [
			new TextRun({ font, text: `${label}: `, bold: true, size: fontSize }),
			new TextRun({ font, text: value, size: fontSize })
		]
	});
