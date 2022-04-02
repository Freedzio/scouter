import dayjs from 'dayjs';
import { AlignmentType, Document, Paragraph, TextRun } from 'docx';
import { marginBig } from '../../../common/document-creator/constants';
import { documentBanner } from '../../../common/document-creator/document-banner';
import { reportLegend } from '../../../common/document-creator/report-legend';
import { sectionHeader } from '../../../common/document-creator/section-header';
import { reportDataLine } from '../../../common/document-creator/simple-data-line';
import { simpleParagraph } from '../../../common/document-creator/simple-paragraph';
import {
	WislaPlockMultipleFormValues,
	Player
} from './wisla-plock-multiple-form.model';

const allPlayerData = (players: Player[]) => {
	let arr = [];

	for (let i = 0; i < players.length; i++) {
		arr.push(reportDataLine(`${i + 1}) IMIĘ I NAZWISKO`, players[i].name));
		arr.push(reportDataLine('POZYCJA', players[i].position));
		arr.push(reportDataLine('DATA URODZENIA', players[i].birthYear));
		arr.push(
			reportDataLine('OCENA WYSTĘPU (SKALA 1-5)', players[i].overallScore)
		);
		arr.push(reportDataLine('KATEGORIA', players[i].category));
		arr.push(reportDataLine('KRÓTKI OPIS', players[i].summary, true));
	}

	return arr.flat();
};

export const createMultipleReportWislaPlock = async (
	data: WislaPlockMultipleFormValues
) =>
	new Document({
		sections: [
			{
				children: [
					documentBanner,
					new Paragraph({
						spacing: {
							before: marginBig,
							after: marginBig
						},
						alignment: AlignmentType.CENTER,
						children: [
							new TextRun({
								text: 'ARKUSZ OBSERWACYJNY',
								bold: true,
								size: 26
							})
						]
					}),
					sectionHeader('OBSERWOWANY MECZ'),
					sectionHeader(data.fixture),
					reportDataLine('SKAUT', data.scout),
					reportDataLine('DATA', dayjs(data.fixtureDate).format('DD.MM.YYYY')),
					reportDataLine('WARUNKI POGODOWE', data.weather),
					reportDataLine('POZIOM ROZGRYWKOWY', data.fixtureLevel, true),
					reportDataLine(
						'DRUŻYNA GOSPODARZY - System gry',
						data.homeTeam.system
					),
					simpleParagraph('Wyróżniający się zawodnicy', true),
					...allPlayerData(data.homeTeam.observedPlayers),
					reportDataLine('DRUŻYNA GOŚCI - System gry', data.awayTeam.system),
					simpleParagraph('Wyróżniający się zawodnicy', true),
					...allPlayerData(data.awayTeam.observedPlayers),
					sectionHeader('DODATKOWE NOTATKI/UWAGI'),
					simpleParagraph(data.additionalNotes),
					reportLegend
				]
			}
		]
	});
