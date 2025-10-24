import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAhdScreeningQuery } from '../impl/get-ahd-screening.query';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetAhdScreeningQuery)
export class GetAhdScreeningHandler implements IQueryHandler<GetAhdScreeningQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(query: GetAhdScreeningQuery): Promise<any> {
        const filters = [];
        if (query.county) {
            filters.push('County In (:...counties)')
        }

        if (query.subCounty) {
            filters.push('SubCounty In (:...subCounties)')
        }

        if (query.facility) {
            filters.push('FacilityName In (:...facilities)')
        }

        if (query.partner) {
            filters.push('PartnerName In (:...partners)')
        }

        if (query.agency) {
            filters.push('AgencyName In (:...agencies)')
        }

        if (query.datimAgeGroup) {
            filters.push('AgeGroup In (:...ageGroups)')
        }

        if (query.gender) {
            filters.push('Gender In (:...genders)')
        }

        const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : ``;

        const ahdScreening = this.repository
            .createQueryBuilder('f')
            .select([`TOP 1
                (SELECT
                     SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END)
                   FROM REPORTING.dbo.linelist_FactART ${whereClause} ) AS NewPatient,
                
                (SELECT
                     SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END)
                   FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                   ((WhoStage IS NOT NULL) OR (LastCD4 IS NOT NULL)) ) AS AHDScreened,
                
                (SELECT
                     SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END)
                   FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                   AHD = 1) AS AHD,
                (SELECT
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 (LatestCD4WithinLastOneYear is not null OR LastCD4PercentageWithinLastOneYear is not null)) AS DoneCD4Test,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 CD4WithinLastOneYearLess200OrLess25Percent = 1 ) AS less200CD4,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and DoneTBLamTest=1) AS DoneTBLamTest,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and DoneTBLamTest=1 and TBLamPositive=1) AS TBLamPositive,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and DoneTBLamTest=1 and TBLamPositive=1 and TBLamPosonTBRx=1) AS tbInitiated,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and DoneCrAgTest=1) AS DoneCrAgTest,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and DoneCrAgTest=1 and CrAgPositive=1) AS CrAgPositive,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and CSFCrAg=1) AS CSFCrAg,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1   and CSFCrAg=1 and CSFCrAgPositive=1) AS CSFCrAgPositive,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and CSFCrAg=1 and CSFCrAgPositive=1  and  InitiatedCMTreatment=1) AS InitiatedCMTreatment,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and CSFCrAg=1 and CSFCrAgPositive=1  and  InitiatedCMTreatment=1 and  PreemtiveCMTheraphy=1) AS PreemtiveCMTheraphy
            `])

        const params = {
            facilities: query.facility,
            counties: query.county,
            subCounties: query.subCounty,
            partners: query.partner,
            agencies: query.agency,
            ageGroups: query.datimAgeGroup,
            genders: query.gender
        }

        return await ahdScreening.setParameters(params).getRawOne();
    }
}
