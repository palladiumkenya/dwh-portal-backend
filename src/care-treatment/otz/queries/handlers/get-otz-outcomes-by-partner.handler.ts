import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesByPartnerQuery } from '../impl/get-otz-outcomes-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzOutcome } from '../../entities/fact-trans-otz-outcome.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzOutcomesByPartnerQuery)
export class GetOtzOutcomesByPartnerHandler implements IQueryHandler<GetOtzOutcomesByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransOtzOutcome, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOtzOutcomesByPartnerQuery): Promise<any> {
        const otzOutcomesByPartner = this.repository.createQueryBuilder('f')
            .select(['[CTPartner] partner, CASE WHEN [Outcome] IS NULL THEN \'Active\' ELSE [Outcome] END AS Outcome, SUM([Total_OutCome]) outcomesByPartner'])
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
            otzOutcomesByPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzOutcomesByPartner.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await otzOutcomesByPartner
            .groupBy('[CTPartner], [Outcome]')
            .getRawMany();
    }
}
