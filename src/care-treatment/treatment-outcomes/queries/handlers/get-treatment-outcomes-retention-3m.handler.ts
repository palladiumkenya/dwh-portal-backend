import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTreatmentOutcomesRetention3mQuery } from '../impl/get-treatment-outcomes-retention-3m.query';
import { FactTransCohortRetention } from '../../entities/fact-trans-cohort-retention.model';

@QueryHandler(GetTreatmentOutcomesRetention3mQuery)
export class GetTreatmentOutcomesRetention3mHandler implements IQueryHandler<GetTreatmentOutcomesRetention3mQuery> {
    constructor(
        @InjectRepository(FactTransCohortRetention, 'mssql')
        private readonly repository: Repository<FactTransCohortRetention>
    ) {

    }

    async execute(query: GetTreatmentOutcomesRetention3mQuery): Promise<any> {
        const retention = this.repository.createQueryBuilder('f')
            .select(['StartARTYear, SUM([M3Retained]) m3Retention,SUM(f.[M3NetCohort]) as netcohort, IIF (SUM ( f.[M3NetCohort] ) != 0, (SUM(f.[M3Retained]) * 100.0)/ Sum(SUM(f.[M3NetCohort])) OVER (partition by StartARTYear Order by StartARTYear), 0) AS Percentage'])
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
            retention.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            retention.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            retention.andWhere('f.AgeGroupCleaned IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            retention.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await retention
            .groupBy('f.StartARTYear')
            .orderBy('f.StartArtYear')
            .getRawMany();
    }
}
