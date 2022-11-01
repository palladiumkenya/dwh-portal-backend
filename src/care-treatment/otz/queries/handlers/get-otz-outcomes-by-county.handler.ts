import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesByCountyQuery } from '../impl/get-otz-outcomes-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzOutcome } from '../../entities/fact-trans-otz-outcome.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzOutcomesByCountyQuery)
export class GetOtzOutcomesByCountyHandler implements IQueryHandler<GetOtzOutcomesByCountyQuery> {
    constructor(
        @InjectRepository(FactTransOtzOutcome, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOtzOutcomesByCountyQuery): Promise<any> {
        const otzOutcomesByCounty = this.repository.createQueryBuilder('f')
            .select(['[County], CASE WHEN [Outcome] IS NULL THEN \'Active\' WHEN [Outcome] = \'Dead\' THEN \'Died\' ELSE [Outcome] END AS Outcome, SUM([Total_OutCome]) outcomesByCounty'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            otzOutcomesByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzOutcomesByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzOutcomesByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzOutcomesByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzOutcomesByCounty.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            otzOutcomesByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            otzOutcomesByCounty.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await otzOutcomesByCounty
            .groupBy(
                "[County], CASE WHEN [Outcome] IS NULL THEN 'Active' WHEN [Outcome] = 'Dead' THEN 'Died' ELSE [Outcome] END",
            )
            .getRawMany();
    }
}
