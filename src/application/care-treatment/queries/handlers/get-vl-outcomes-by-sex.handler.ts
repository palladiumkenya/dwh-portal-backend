import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOutcome } from 'src/entities/care_treatment/fact-trans-vl-outcome.model';
import { GetVlOutcomesBySexQuery } from '../get-vl-outcomes-by-sex.query';

@QueryHandler(GetVlOutcomesBySexQuery)
export class GetVlOutcomesBySexHandler implements IQueryHandler<GetVlOutcomesBySexQuery> {
    constructor(
        @InjectRepository(FactTransVLOutcome, 'mssql')
        private readonly repository: Repository<FactTransVLOutcome>
    ) {
    }

    async execute(query: GetVlOutcomesBySexQuery): Promise<any> {
        const vlOutcomesBySex = this.repository.createQueryBuilder('f')
            .select(['f.Gender gender, f.Last12MVLResult outcome, SUM(f.Total_Last12MVL) count'])
            .where('f.MFLCode > 0')
            .andWhere('f.Gender IS NOT NULL')
            .andWhere('f.Last12MVLResult IS NOT NULL');

        if (query.county) {
            vlOutcomesBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlOutcomesBySex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlOutcomesBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlOutcomesBySex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlOutcomesBySex
            .groupBy('f.Gender, f.Last12MVLResult')
            .orderBy('f.Gender, f.Last12MVLResult')
            .getRawMany();
    }
}
