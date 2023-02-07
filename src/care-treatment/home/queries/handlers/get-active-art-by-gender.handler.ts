import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetActiveArtByGenderQuery } from '../impl/get-active-art-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { LinelistFACTART } from './../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetActiveArtByGenderQuery)
export class GetActiveArtByGenderHandler implements IQueryHandler<GetActiveArtByGenderQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {
    }

    async execute(query: GetActiveArtByGenderQuery): Promise<any> {
        const activeArt = this.repository
            .createQueryBuilder('f')
            .select(['SUM([ISTxCurr]) ActiveART,[Gender]'])
            .groupBy('[Gender]');

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
