import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { GetActiveArtAdolescentsQuery } from '../impl/get-active-art-adolescents.query';
import { LinelistFACTART } from './../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetActiveArtAdolescentsQuery)
export class GetActiveArtAdolescentsHandler implements IQueryHandler<GetActiveArtAdolescentsQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {
    }

    async execute(query: GetActiveArtAdolescentsQuery): Promise<any> {
        const activeArt = this.repository
            .createQueryBuilder('f')
            .select('SUM(f.[ISTxCurr])', 'ActiveARTAdolescents')
            .where("f.[age] between 10 and 19");

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
