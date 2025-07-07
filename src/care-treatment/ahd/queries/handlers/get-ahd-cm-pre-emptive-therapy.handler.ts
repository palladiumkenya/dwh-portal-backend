import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAhdCmPreEmptiveTherapyQuery } from '../impl/get-ahd-cm-pre-emptive-therapy.query';

@QueryHandler(GetAhdCmPreEmptiveTherapyQuery)
export class GetAhdCmPreEmptiveTherapyHandler implements IQueryHandler<GetAhdCmPreEmptiveTherapyQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {}

    async execute(query: GetAhdCmPreEmptiveTherapyQuery): Promise<any> {
        const filters = [];

        if (query.county) filters.push('County In (:...counties)');
        if (query.subCounty) filters.push('SubCounty In (:...subCounties)');
        if (query.facility) filters.push('FacilityName In (:...facilities)');
        if (query.partner) filters.push('PartnerName In (:...partners)');
        if (query.agency) filters.push('AgencyName In (:...agencies)');
        if (query.datimAgeGroup) filters.push('AgeGroup In (:...ageGroups)');
        if (query.gender) filters.push('Gender In (:...genders)');

        const baseWhere = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
        const extraWhere = filters.length ? ' AND ' : ' WHERE ';

        const ahdCMTherapy = this.repository
        .createQueryBuilder('f')
        .select([`TOP 1
            (SELECT SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END)
                 FROM REPORTING.dbo.linelist_FactART
                 ${baseWhere}${extraWhere}AHD = 1 AND DoneCrAgTest = 1 AND CrAgPositive = 1) AS CrAgPositive,
                 
            (SELECT SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                 FROM REPORTING.dbo.linelist_FactART
                 ${baseWhere}${extraWhere}AHD = 1 AND CSFCrAg = 1) AS DoneCSFCrAg,
                 
            (SELECT SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                 FROM REPORTING.dbo.linelist_FactART
                 ${baseWhere}${extraWhere}AHD = 1 AND CSFCrAg = 1 AND CSFCrAgPositive = 1) AS CSFCrAgPositive,
                 
            (SELECT SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                 FROM REPORTING.dbo.linelist_FactART
                 ${baseWhere}${extraWhere}AHD = 1 AND CSFCrAg = 1 AND CSFCrAgPositive = 0) AS CSFCrAgNegative,
                 
            (SELECT SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                 FROM REPORTING.dbo.linelist_FactART
                 ${baseWhere}${extraWhere}AHD = 1 AND CSFCrAg = 0) AS CSFCrAgNotDone,
                 
            (SELECT SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END)
                 FROM REPORTING.dbo.linelist_FactART
                 ${baseWhere}${extraWhere}AHD = 1 AND EligibleForPreemtiveTherapy = 1) AS EligibleForPreemptiveTherapy,
                 
            (SELECT SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                        SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END)
                 FROM REPORTING.dbo.linelist_FactART
                 ${baseWhere}${extraWhere}AHD = 1 AND EligibleForPreemtiveTherapy = 1 AND PreemtiveCMTheraphy = 1) AS InitiatedPreemptiveCMTherapy
        `]);

        const params = {
            counties: query.county,
            subCounties: query.subCounty,
            facilities: query.facility,
            partners: query.partner,
            agencies: query.agency,
            ageGroups: query.datimAgeGroup,
            genders: query.gender,
        };

        return await ahdCMTherapy.setParameters(params).getRawOne();
    }
}
