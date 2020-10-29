import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtViralLoadCascadeActiveArtClientsQuery } from '../get-ct-viral-load-cascade-active-art-clients.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtViralLoadCascadeActiveArtClientsQuery)
export class GetCtViralLoadCascadeActiveArtClientsHandler implements IQueryHandler<GetCtViralLoadCascadeActiveArtClientsQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtViralLoadCascadeActiveArtClientsQuery): Promise<any> {
        const viralLoadCascade = this.repository.createQueryBuilder('f')
            .select(['SUM([TXCURR_Total]) TX_CURR, SUM([Eligible4VL]) Eligible4VL, SUM([Last12MonthVL]) Last12MonthVL, SUM([Last12MVLSup]) Last12MVLSup'])
            .where('f.[TXCURR_Total] IS NOT NULL');

        if (query.county) {
            viralLoadCascade
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            viralLoadCascade
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            viralLoadCascade
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            viralLoadCascade
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await viralLoadCascade
            .getRawOne();
    }
}
