import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTreatmentOutcomesRetention12mQuery } from '../impl/get-treatment-outcomes-retention-12m.query';
import { FactTransCohortRetention } from '../../entities/fact-trans-cohort-retention.model';

@QueryHandler(GetTreatmentOutcomesRetention12mQuery)
export class GetTreatmentOutcomesRetention12mHandler implements IQueryHandler<GetTreatmentOutcomesRetention12mQuery> {
    constructor(
        @InjectRepository(FactTransCohortRetention, 'mssql')
        private readonly repository: Repository<FactTransCohortRetention>
    ) {

    }

    async execute(query: GetTreatmentOutcomesRetention12mQuery): Promise<any> {
        const retention = this.repository.createQueryBuilder('f')
            .select(['StartARTYear, SUM([M12Retained]) m12Retention, (SUM(f.[M12Retained]) * 100.0)/ Sum(SUM(f.[M12NetCohort])) OVER (partition by StartARTYear Order by StartARTYear) AS Percentage'])
            .where('Year(GetDate())- StartARTYear <=10');

        if (query.county) {
            retention.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            retention.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            retention.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            retention.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            retention.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            retention.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            retention.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await retention
            .groupBy('f.StartArtYear')
            .having('SUM([M12NetCohort])>0')
            .orderBy('f.StartArtYear')
            .getRawMany();
    }
}
