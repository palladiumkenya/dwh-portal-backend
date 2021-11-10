import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesByYearOfArtStartQuery } from '../impl/get-otz-outcomes-by-year-of-art-start.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzOutcome } from '../../entities/fact-trans-otz-outcome.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzOutcomesByYearOfArtStartQuery)
export class GetOtzOutcomesByYearOfArtStartHandler implements IQueryHandler<GetOtzOutcomesByYearOfArtStartQuery> {
    constructor(
        @InjectRepository(FactTransOtzOutcome, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOtzOutcomesByYearOfArtStartQuery): Promise<any> {
        const otzOutcomesByYearOfArtStart = this.repository.createQueryBuilder('f')
            .select(['[OTZStart_Year], CASE WHEN [Outcome] IS NULL THEN \'Active\' ELSE [Outcome] END AS Outcome, SUM([Total_OutCome]) outcomesByYearOfArtStart'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            otzOutcomesByYearOfArtStart.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzOutcomesByYearOfArtStart.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzOutcomesByYearOfArtStart.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzOutcomesByYearOfArtStart.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzOutcomesByYearOfArtStart.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await otzOutcomesByYearOfArtStart
            .groupBy('[OTZStart_Year], [Outcome]')
            .getRawMany();
    }
}
