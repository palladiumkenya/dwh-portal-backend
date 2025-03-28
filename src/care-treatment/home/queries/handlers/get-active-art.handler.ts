import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetActiveArtQuery } from '../impl/get-active-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetActiveArtQuery)
export class GetActiveArtHandler implements IQueryHandler<GetActiveArtQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {
    }

    async execute(query: GetActiveArtQuery): Promise<any> {
        const activeArt = this.repository
            .createQueryBuilder('f')
            .select('SUM(f.[ISTxCurr])', 'ActiveART')
            .where('f.[ISTxCurr] > 0');

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
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        return await activeArt.getRawMany();
    }
}
