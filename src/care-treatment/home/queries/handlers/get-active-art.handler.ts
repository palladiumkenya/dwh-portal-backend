import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetActiveArtQuery } from '../impl/get-active-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';

@QueryHandler(GetActiveArtQuery)
export class GetActiveArtHandler implements IQueryHandler<GetActiveArtQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetActiveArtQuery): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select('SUM(f.[TXCURR_Total])', 'ActiveART')
            .where('f.[TXCURR_Total] > 0');

        if (query.county) {
            activeArt
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            activeArt
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            activeArt
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            activeArt
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await activeArt.getRawMany();
    }
}
