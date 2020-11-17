import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { GetActiveArtAdolescentsQuery } from '../impl/get-active-art-adolescents.query';

@QueryHandler(GetActiveArtAdolescentsQuery)
export class GetActiveArtAdolescentsHandler implements IQueryHandler<GetActiveArtAdolescentsQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetActiveArtAdolescentsQuery): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select('SUM(f.[TXCURR_Total])', 'ActiveARTAdolescents')
            .where("f.[ageGroup] IN ('10-14', '15-19')");

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
