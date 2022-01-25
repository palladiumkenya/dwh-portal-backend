import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesByPopulationTypeQuery } from '../impl/get-otz-outcomes-by-population-type.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzOutcome } from '../../entities/fact-trans-otz-outcome.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzOutcomesByPopulationTypeQuery)
export class GetOtzOutcomesByPopulationTypeHandler implements IQueryHandler<GetOtzOutcomesByPopulationTypeQuery> {
    constructor(
        @InjectRepository(FactTransOtzOutcome, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOtzOutcomesByPopulationTypeQuery): Promise<any> {
        const otzOutcomesByPopulationType = this.repository.createQueryBuilder('f')
            .select(['[PopulationType], CASE WHEN [Outcome] IS NULL THEN \'Active\' ELSE [Outcome] END AS Outcome, SUM([Total_OutCome]) outcomesByPopulationType'])
            .andWhere('f.MFLCode IS NOT NULL AND [PopulationType] IS NOT NULL');

        if (query.county) {
            otzOutcomesByPopulationType.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzOutcomesByPopulationType.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzOutcomesByPopulationType.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzOutcomesByPopulationType.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzOutcomesByPopulationType.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            otzOutcomesByPopulationType.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            otzOutcomesByPopulationType.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await otzOutcomesByPopulationType
            .groupBy('[PopulationType], [Outcome]')
            .getRawMany();
    }
}
