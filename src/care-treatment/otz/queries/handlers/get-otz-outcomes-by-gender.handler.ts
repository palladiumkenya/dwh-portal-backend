import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesByGenderQuery } from '../impl/get-otz-outcomes-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzOutcome } from '../../entities/fact-trans-otz-outcome.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzOutcomesByGenderQuery)
export class GetOtzOutcomesByGenderHandler implements IQueryHandler<GetOtzOutcomesByGenderQuery> {
    constructor(
        @InjectRepository(FactTransOtzOutcome, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOtzOutcomesByGenderQuery): Promise<any> {
        const otzOutcomesByGender = this.repository.createQueryBuilder('f')
            .select(['[Gender], CASE WHEN [Outcome] IS NULL THEN \'Active\' ELSE [Outcome] END, SUM([Total_OutCome]) outcomesByGender'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            otzOutcomesByGender.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzOutcomesByGender.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzOutcomesByGender.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzOutcomesByGender.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await otzOutcomesByGender
            .groupBy('[Gender], [Outcome]')
            .getRawMany();
    }
}
