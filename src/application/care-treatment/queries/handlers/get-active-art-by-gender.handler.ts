import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetActiveArtByGenderQuery } from '../get-active-art-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetActiveArtByGenderQuery)
export class GetActiveArtByGenderHandler implements IQueryHandler<GetActiveArtByGenderQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetActiveArtByGenderQuery): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select(['SUM([TXCURR_Total]) ActiveART,[Gender]'])
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
                .andWhere('f.CTPartner IN (:...partners)', { facilities: query.partner });
        }

        return await activeArt.getRawMany();
    }
}
