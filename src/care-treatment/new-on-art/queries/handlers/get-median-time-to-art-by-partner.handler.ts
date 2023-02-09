import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMedianTimeToArtByPartnerQuery } from '../impl/get-median-time-to-art-by-partner.query';
import { AggregateTimeToARTLast12M } from '../../entities/aggregate-time-to-art-last-12-m.model';

@QueryHandler(GetMedianTimeToArtByPartnerQuery)
export class GetMedianTimeToArtByPartnerHandler implements IQueryHandler<GetMedianTimeToArtByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateTimeToARTLast12M, 'mssql')
        private readonly repository: Repository<AggregateTimeToARTLast12M>
    ) {

    }

    async execute(query: GetMedianTimeToArtByPartnerQuery): Promise<any> {
        let medianTimeToARTPartnerSql = this.repository
            .createQueryBuilder('f')
            .select([
                'CTPartner partner, MedianTimeToARTDiagnosis_yearPartner medianTime',
            ])
            .where('f.[CTPartner] IS NOT NULL')
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
                .select(['CTPartner partner, MedianTimeToARTDiagnosis_yearCounty medianTime'])
                .andWhere('f.County IN (:...counties)', { counties: query.county });

            return await medianTimeToARTPartnerSql
                .groupBy('CTPartner, MedianTimeToARTDiagnosis_yearCounty')
                .orderBy('f.MedianTimeToARTDiagnosis_yearCounty', 'DESC')
                .getRawMany();
        }

        if (query.subCounty) {
            medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
                .select(['CTPartner partner, MedianTimeToARTDiagnosis_yearSbCty medianTime'])
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });


            return await medianTimeToARTPartnerSql
                .groupBy('CTPartner, MedianTimeToARTDiagnosis_yearSbCty')
                .orderBy('f.MedianTimeToARTDiagnosis_yearSbCty', 'DESC')
                .getRawMany();
        }

        if (query.partner) {
            medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
                .select(['CTPartner partner, MedianTimeToARTDiagnosis_yearPartner medianTime'])
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });

            return await medianTimeToARTPartnerSql
                .groupBy('CTPartner, MedianTimeToARTDiagnosis_yearPartner')
                .orderBy('f.MedianTimeToARTDiagnosis_yearPartner', 'DESC')
                .getRawMany();
        }

        if (query.agency) {
            medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
                .select(['CTPartner partner, MedianTimeToARTDiagnosis_yearCTAgency medianTime'])
                .andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });

            return await medianTimeToARTPartnerSql
                .groupBy('CTPartner, MedianTimeToARTDiagnosis_yearCTAgency')
                .orderBy('f.MedianTimeToARTDiagnosis_yearCTAgency', 'DESC')
                .getRawMany();
        }

        if (query.gender) {
            medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
                .select(['CTPartner partner, MedianTimeToART_Gender medianTime'])
                .andWhere('f.Gender IN (:...genders)', { genders: query.gender });

            return await medianTimeToARTPartnerSql
                .groupBy('CTPartner, MedianTimeToART_Gender')
                .orderBy('f.MedianTimeToART_Gender', 'DESC')
                .getRawMany();
        }

        if (query.datimAgeGroup) {
            medianTimeToARTPartnerSql = this.repository.createQueryBuilder('f')
                .select(['CTPartner partner, MedianTimeToART_DATIM_AgeGroup medianTime'])
                .andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });

            return await medianTimeToARTPartnerSql
                .groupBy('CTPartner, MedianTimeToART_DATIM_AgeGroup')
                .orderBy('f.MedianTimeToART_DATIM_AgeGroup', 'DESC')
                .getRawMany();
        }

        return await medianTimeToARTPartnerSql
            .groupBy('CTPartner, MedianTimeToARTDiagnosis_yearPartner')
            .orderBy('f.MedianTimeToARTDiagnosis_yearPartner', 'DESC')
            .getRawMany();
    }
}
