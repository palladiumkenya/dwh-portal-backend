import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetActiveArtAdultsQuery } from '../impl/get-active-art-adults.query';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetActiveArtAdultsQuery)
export class GetActiveAdultsHandler implements IQueryHandler<GetActiveArtAdultsQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {
    }

    async execute(query: GetActiveArtAdultsQuery): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select('SUM(f.[ISTxCurr])', 'ActiveARTAdults')
            .where("f.[age] >= 15");

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
