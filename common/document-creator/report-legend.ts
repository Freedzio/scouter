import { Paragraph, TextRun } from 'docx';
import { font } from './constants';

export const reportLegend = new Paragraph({
	children: [
		new TextRun({ italics: true, font, text: 'LEGENDA: ' }),
		new TextRun({ italics: true, font, text: 'Kat. A -> ', bold: true }),
		new TextRun({ italics: true, font, text: 'Bardzo obiecujący ' }),
		new TextRun({ italics: true, font, text: 'Kat. B -> ', bold: true }),
		new TextRun({ italics: true, font, text: 'Do dalszej obserwacji ' }),
		new TextRun({ italics: true, font, text: 'Kat. C -> ', bold: true }),
		new TextRun({ italics: true, font, text: 'Zawodnik nie warty obserwacji ' })
	]
});
