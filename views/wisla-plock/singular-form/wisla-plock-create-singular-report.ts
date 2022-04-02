import dayjs from 'dayjs';
import { Document } from 'docx';
import { documentBanner } from '../../../common/document-creator/document-banner';
import { reportLegend } from '../../../common/document-creator/report-legend';
import { sectionHeader } from '../../../common/document-creator/section-header';
import { reportDataLine } from '../../../common/document-creator/simple-data-line';
import { simpleParagraph } from '../../../common/document-creator/simple-paragraph';
import { WislaPlockSingularFormValues } from './wsila-plock-singular-form.model';

export const createSingularReportWislaPlock = async (
	data: WislaPlockSingularFormValues
) =>
	new Document({
		sections: [
			{
				children: [
					documentBanner,
					sectionHeader('ARKUSZ OBSERWACYJNY'),
					reportDataLine('SKAUT', data.scout),
					reportDataLine('DATA', dayjs(data.fixtureDate).format('DD.MM.YYYY')),
					reportDataLine('WARUNKI POGODOWE', data.weather),
					reportDataLine('OBSERWOWANY MECZ', data.fixture),
					reportDataLine('POZIOM ROZGRYWKOWY', data.fixtureLevel),
					reportDataLine('OBSERWOWANY ZAWODNIK', data.player),
					reportDataLine('KLUB ZAWODNIKA', data.club),
					reportDataLine('USTAWIENIE DRUŻYNY', data.teamComposition),
					reportDataLine('POZYCJA', data.position),
					reportDataLine('WIEK (DATA URODZENIA)', data.age),
					reportDataLine('WZROST', data.height),
					reportDataLine('WAGA', data.weight),
					reportDataLine('BUDOWA CIAŁA', data.bodyType),
					reportDataLine('POZYCJA I WYBORU', data.firstChoice),
					reportDataLine('POZYCJA II WYBORU', data.secondChoice),
					reportDataLine('POZYCJA III WYBORU', data.thirdChoice),
					reportDataLine('PREFEROWANA NOGA', data.leg),
					reportDataLine(
						'PROFIL ZAWODNIKA (porównanie do kogoś z Ekstraklasy / europejskiej piłki)',
						data.playerProfile
					),
					sectionHeader('CECHY MENTALNE'),
					reportDataLine(
						'ZACHOWANIE PO STRACIE PIŁKI',
						data.mentalTraits.postLossBehavior
					),
					reportDataLine(
						'KOMUNIKACJA Z RESZTĄ DRUŻYNY',
						data.mentalTraits.communication
					),
					reportDataLine('PRACOWITOŚĆ', data.mentalTraits.diligence),
					reportDataLine('ODWAGA', data.mentalTraits.courage),
					reportDataLine('KREATYWNOŚĆ', data.mentalTraits.creativity),
					reportDataLine('DETERMINACJA', data.mentalTraits.determination),
					reportDataLine('CECHY PRZYWÓDCZE', data.mentalTraits.leadership),
					reportDataLine(
						'AGRESJA W ODBIORZE PIŁKI',
						data.mentalTraits.takeoverAggression
					),
					reportDataLine(
						'DOŚWIADCZENIE BOISKOWE (CWANIACTWO)',
						data.mentalTraits.cunningness
					),
					reportDataLine('DECYZYJNOŚĆ', data.mentalTraits.decisionMaking),
					sectionHeader('CECHY FIZYCZNE'),

					reportDataLine('SZYBKOŚĆ (SKALA 1-5)', data.physicalTraits.speed),
					reportDataLine(
						'SKOCZNOŚĆ (SKALA 1-5)',
						data.physicalTraits.jumpiness
					),
					reportDataLine('ZWROTNOŚĆ (SKALA 1-5)', data.physicalTraits.agility),
					reportDataLine(
						'SZYBKOŚĆ STARTOWA (SKALA 1-5)',
						data.physicalTraits.startSpeed
					),

					sectionHeader('CECHY TECHNICZNE'),
					reportDataLine(
						'OCENA WYSTĘPU (SKALA 1-5)',
						data.technicalTraits.overallScore
					),
					reportDataLine('KATEGORIA', data.technicalTraits.category),
					sectionHeader('KRÓTKI OPIS / PODSUMOWANIE'),
					simpleParagraph(data.summary),
					reportLegend
				]
			}
		]
	});
