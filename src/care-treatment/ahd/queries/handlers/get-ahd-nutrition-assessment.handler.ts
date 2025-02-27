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

        const ahdAssessment = this.repository
            .createQueryBuilder('f')
            .select([`TOP 1
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                     AHD=1 and age <15) AS ChildrenWithAHD,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and age <15 and ScreenedForMalnutrition=1) AS ScreenedForMalnutrition,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and age <15 and SAM=1) AS NumberWithSAM,
                (SELECT 
                  SUM(CASE WHEN IsRTTLast12MonthsAfter3monthsIIT = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN ConfirmedTreatmentFailure = 1 THEN 1 ELSE 0 END) +
                  SUM(CASE WHEN NewPatient = 1 THEN 1 ELSE 0 END) AS TotalCount
                FROM REPORTING.dbo.linelist_FactART
                    ${whereClause} ${filters.length ? ' AND ': 'WHERE '}
                 AHD=1 and age <15 and MAM=1) AS NumberWithMAM
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

        return await ahdAssessment.setParameters(params).getRawOne();
    }
}
