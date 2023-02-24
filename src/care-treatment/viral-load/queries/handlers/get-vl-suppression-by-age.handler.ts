import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOutcome } from '../../entities/fact-trans-vl-outcome.model';
import { GetVlSuppressionByAgeQuery } from '../impl/get-vl-suppression-by-age.query';
import { AggregateVLUptakeOutcome } from './../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(GetVlSuppressionByAgeQuery)
export class GetVlSuppressionByAgeHandler implements IQueryHandler<GetVlSuppressionByAgeQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlSuppressionByAgeQuery): Promise<any> {
        const vlSuppressionByAge = this.repository.createQueryBuilder('f')
            .select(['f.AgeGroup ageGroup, f.Last12MVLResult suppression, SUM(f.TotalLast12MVL) vlDone'])
            .where('f.MFLCode > 0')
            .andWhere('f.AgeGroup IS NOT NULL')
            .andWhere('f.Last12MVLResult IS NOT NULL');

        if (query.county) {
            vlSuppressionByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionByAge.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionByAge.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionByAge.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionByAge.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionByAge.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionByAge
            .groupBy('f.AgeGroup, f.Last12MVLResult')
            .orderBy('f.AgeGroup, f.Last12MVLResult')
            .getRawMany();
    }
}
