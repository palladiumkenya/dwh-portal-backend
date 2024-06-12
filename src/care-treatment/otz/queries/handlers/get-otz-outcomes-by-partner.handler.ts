import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesByPartnerQuery } from '../impl/get-otz-outcomes-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOTZOutcome } from '../../entities/aggregate-otz-outcome.model';

@QueryHandler(GetOtzOutcomesByPartnerQuery)
export class GetOtzOutcomesByPartnerHandler implements IQueryHandler<GetOtzOutcomesByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateOTZOutcome, 'mssql')
        private readonly repository: Repository<AggregateOTZOutcome>
    ) {
    }

    async execute(query: GetOtzOutcomesByPartnerQuery): Promise<any> {
        const otzOutcomesByPartner = this.repository
            .createQueryBuilder('f')
            .select([
                "[PartnerName] partner, CASE WHEN [Outcome] IS NULL THEN 'Active' WHEN [Outcome] = 'Dead' THEN 'Died'  ELSE [Outcome] END AS Outcome, SUM([patients_totalOutcome]) outcomesByPartner",
            ])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            otzOutcomesByPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzOutcomesByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzOutcomesByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzOutcomesByPartner.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzOutcomesByPartner.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            otzOutcomesByPartner.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            otzOutcomesByPartner.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await otzOutcomesByPartner
            .groupBy(`[PartnerName], CASE WHEN [Outcome] IS NULL THEN 'Active' WHEN [Outcome] = 'Dead' THEN 'Died' ELSE [Outcome] END`)
            .getRawMany();
    }
}
