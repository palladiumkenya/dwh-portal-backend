import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlOutcomesOverallQuery } from '../impl/get-vl-outcomes-overall.query';
import { AggregateVLUptakeOutcome } from '../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(GetVlOutcomesOverallQuery)
export class GetVlOutcomesOverallHandler implements IQueryHandler<GetVlOutcomesOverallQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlOutcomesOverallQuery): Promise<any> {
        const vlOutcomesOverall = this.repository.createQueryBuilder('f')
            .select(['f.Last12MVLResult outcome, SUM(f.TotalLast12MVL) count'])
            .where('f.MFLCode > 0')
            .andWhere('f.Last12MVLResult IS NOT NULL');

        if (query.county) {
            vlOutcomesOverall.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlOutcomesOverall.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlOutcomesOverall.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlOutcomesOverall.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlOutcomesOverall.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlOutcomesOverall.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlOutcomesOverall.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlOutcomesOverall
            .groupBy('f.Last12MVLResult')
            .getRawMany();
    }
}
