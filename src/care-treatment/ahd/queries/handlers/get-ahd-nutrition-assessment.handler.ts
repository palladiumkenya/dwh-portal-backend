import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';
import { GetAhdNutritionAssessmentQuery } from '../impl/get-ahd-nutrition-assessment.query';

@QueryHandler(GetAhdNutritionAssessmentQuery)
export class GetAhdNutritionAssessmentHandler implements IQueryHandler<GetAhdNutritionAssessmentQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(query: GetAhdNutritionAssessmentQuery): Promise<any> {
        const ahdAssessment = this.repository
            .createQueryBuilder('f')
            .select([`TOP 1
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                WHERE AHD=1 and age <15) AS ChildrenWithAHD,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                WHERE AHD=1 and age <15 and ScreenedForMalnutrition=1) AS ScreenedForMalnutrition,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                WHERE AHD=1 and age <15 and SAM=1) AS NumberWithSAM,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                WHERE AHD=1 and age <15 and MAM=1) AS NumberWithMAM
            `])

        if (query.county) {
            ahdAssessment.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            ahdAssessment.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            ahdAssessment.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            ahdAssessment.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            ahdAssessment.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            ahdAssessment.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            ahdAssessment.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await ahdAssessment.getRawOne();
    }
}
