import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { GetActiveArtChildrenQuery } from '../get-active-art-children.query';

@QueryHandler(GetActiveArtChildrenQuery)
export class GetActiveChildrenHandler implements IQueryHandler<GetActiveArtChildrenQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetActiveArtChildrenQuery): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select('SUM(f.[TXCURR_Total])', 'ActiveARTChildren')
            .where("f.[ageGroup] IN ('10-14', '<1', '1-4', '5-9')");

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
                .andWhere('f.CTPartner IN (:...partners)', { facilities: query.partner });
        }

        return await activeArt.getRawMany();
    }
}
