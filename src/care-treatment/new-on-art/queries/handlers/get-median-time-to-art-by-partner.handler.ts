import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMedianTimeToArtByPartnerQuery } from '../impl/get-median-time-to-art-by-partner.query';
import { FactCtTimeToArtLast12M } from '../../entities/fact-ct-time-to-art-last-12-m.model';

@QueryHandler(GetMedianTimeToArtByPartnerQuery)
export class GetMedianTimeToArtByPartnerHandler implements IQueryHandler<GetMedianTimeToArtByPartnerQuery> {
    constructor(
        @InjectRepository(FactCtTimeToArtLast12M, 'mssql')
        private readonly repository: Repository<FactCtTimeToArtLast12M>
    ) {

    }

    async execute(query: GetMedianTimeToArtByPartnerQuery): Promise<any> {
        let medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
            .select(['CTPartner partner, MedianTimeToART_Partner medianTime'])
            .where('f.[CTPartner] IS NOT NULL')
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
                .select(['CTPartner partner, MedianTimeToART_Partner medianTime'])
                .andWhere('f.County IN (:...counties)', { counties: query.county });

            return await medianTimeToARTPartnerSql
                .groupBy('CTPartner, MedianTimeToART_Partner')
                .orderBy('f.MedianTimeToART_Partner', 'DESC')
                .getRawMany();
        }

        if (query.subCounty) {
            medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
                .select(['CTPartner partner, MedianTimeToART_Partner medianTime'])
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });


            return await medianTimeToARTPartnerSql
                .groupBy('CTPartner, MedianTimeToART_Partner')
                .orderBy('f.MedianTimeToART_Partner', 'DESC')
                .getRawMany();
        }

        if (query.partner) {
            medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
                .select(['CTPartner partner, MedianTimeToART_Partner medianTime'])
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });

            return await medianTimeToARTPartnerSql
                .groupBy('CTPartner, MedianTimeToART_Partner')
                .orderBy('f.MedianTimeToART_Partner', 'DESC')
                .getRawMany();
        }

        if (query.agency) {
            medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
                .select(['CTPartner partner, MedianTimeToART_Partner medianTime'])
                .andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });

            return await medianTimeToARTPartnerSql
                .groupBy('CTPartner, MedianTimeToART_Partner')
                .orderBy('f.MedianTimeToART_Partner', 'DESC')
                .getRawMany();
        }

        return await medianTimeToARTPartnerSql
            .groupBy('CTPartner, MedianTimeToART_Partner')
            .orderBy('f.MedianTimeToART_Partner', 'DESC')
            .getRawMany();
    }
}
