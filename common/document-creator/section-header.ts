import { Paragraph, AlignmentType, TextRun } from 'docx';
import { font, marginBig, marginSmall, sectionHeaderSize } from './constants';

export const sectionHeader = (text: string) =>
	new Paragraph({
		spacing: {
			before: marginBig,
			after: marginSmall
		},
		alignment: AlignmentType.CENTER,
		children: [
			new TextRun({
				text,
				font,
				size: sectionHeaderSize,
				bold: true,
				underline: { color: 'ffffff' }
			})
		]
	});
