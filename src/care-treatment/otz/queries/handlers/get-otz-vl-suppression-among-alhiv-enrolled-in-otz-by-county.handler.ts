import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyQuery } from '../impl/get-otz-vl-suppression-among-alhiv-enrolled-in-otz-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyQuery)
export class GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyHandler implements IQueryHandler<GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyQuery): Promise<any> {
        const vlSuppressionOtzByCounty = this.repository
            .createQueryBuilder('f')
            .select([
                '[County], Last12MVLResult, SUM([Last12MonthVL]) AS vlSuppression',
            ])
            .andWhere(
                'f.MFLCode IS NOT NULL AND Last12MVLResult IS NOT NULL AND OTZEnrollmentDate IS NOT NULL',
            );

        if (query.county) {
            vlSuppressionOtzByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionOtzByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionOtzByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionOtzByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionOtzByCounty.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionOtzByCounty.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionOtzByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionOtzByCounty
            .groupBy('[County], Last12MVLResult')
            .orderBy('[County]')
            .getRawMany();
    }
}
