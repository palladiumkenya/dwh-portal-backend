import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOutcome } from '../../entities/fact-trans-vl-outcome.model';
import { GetVlOutcomesOverallQuery } from '../impl/get-vl-outcomes-overall.query';

@QueryHandler(GetVlOutcomesOverallQuery)
export class GetVlOutcomesOverallHandler implements IQueryHandler<GetVlOutcomesOverallQuery> {
    constructor(
        @InjectRepository(FactTransVLOutcome, 'mssql')
        private readonly repository: Repository<FactTransVLOutcome>
    ) {
    }

    async execute(query: GetVlOutcomesOverallQuery): Promise<any> {
        const vlOutcomesOverall = this.repository.createQueryBuilder('f')
            .select(['f.Last12MVLResult outcome, SUM(f.Total_Last12MVL) count'])
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
            vlOutcomesOverall.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlOutcomesOverall
            .groupBy('f.Last12MVLResult')
            .getRawMany();
    }
}
