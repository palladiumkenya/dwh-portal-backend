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
        const ahdScreening = this.repository
            .createQueryBuilder('f')
            .select([`TOP 1
                (SELECT
                     SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END)
                   FROM REPORTING.dbo.linelist_FactART) AS NewPatient,
                
                (SELECT
                     SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END)
                   FROM REPORTING.dbo.linelist_FactART
                   WHERE (WhoStage IS NOT NULL) OR (LastCD4 IS NOT NULL)) AS AHDScreened,
                
                (SELECT
                     SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                     SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END)
                   FROM REPORTING.dbo.linelist_FactART
                   WHERE AHD = 1) AS AHD,
                (SELECT
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where LastCD4 is not null) AS DoneCD4Test,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where  CONVERT(float, LastCD4) < 200 OR TRY_CAST(LastCD4Percentage AS decimal) < 25) AS less200CD4,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where AHD=1 and DoneTBLamTest=1) AS DoneTBLamTest,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where AHD=1 and DoneTBLamTest=1 and TBLamPositive=1) AS TBLamPositive,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where AHD=1 and DoneTBLamTest=1 and TBLamPositive=1 and TBLamPosonTBRx=1) AS tbInitiated,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where AHD=1 and DoneCrAgTest=1) AS DoneCrAgTest,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where AHD=1 and DoneCrAgTest=1 and CrAgPositive=1) AS CrAgPositive,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where AHD=1   and CSFCrAg=1) AS CSFCrAg,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where AHD=1   and CSFCrAg=1 and CSFCrAgPositive=1) AS CSFCrAgPositive,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where AHD=1 and CSFCrAg=1 and CSFCrAgPositive=1  and  InitiatedCMTreatment=1) AS InitiatedCMTreatment,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                where AHD=1 and CSFCrAg=1 and CSFCrAgPositive=1  and  InitiatedCMTreatment=1 and  PreemtiveCMTheraphy=1) AS PreemtiveCMTheraphy
            `])

        if (query.county) {
            ahdScreening.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            ahdScreening.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            ahdScreening.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            ahdScreening.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            ahdScreening.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            ahdScreening.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            ahdScreening.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await ahdScreening.getRawOne();
    }
}
