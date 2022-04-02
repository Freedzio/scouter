import { Paragraph, TextRun } from 'docx';
import { marginSmall, fontSize, font } from './constants';

export const simpleParagraph = (text: string, bold?: boolean) =>
	new Paragraph({
		spacing: {
			after: marginSmall
		},
		children: [new TextRun({ font, text, bold, size: fontSize })]
	});
