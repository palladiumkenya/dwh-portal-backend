import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMedianTimeToArtByCountyQuery } from '../impl/get-median-time-to-art-by-county.query';
import { AggregateTimeToARTLast12M } from './../../entities/aggregate-time-to-art-last-12-m.model';

@QueryHandler(GetMedianTimeToArtByCountyQuery)
export class GetMedianTimeToArtByCountyHandler implements IQueryHandler<GetMedianTimeToArtByCountyQuery> {
    constructor(
        @InjectRepository(AggregateTimeToARTLast12M, 'mssql')
        private readonly repository: Repository<AggregateTimeToARTLast12M>
    ) {

    }

    async execute(query: GetMedianTimeToArtByCountyQuery): Promise<any> {
        let medianTimeToARTCountySql = this.repository
            .createQueryBuilder('f')
            .select([
                'County county, MedianTimeToARTDiagnosis_yearCounty medianTime',
            ])
            .where('f.[County] IS NOT NULL')
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToARTCountySql = this.repository
                .createQueryBuilder('f')
                .select([
                    'SubCounty county, MedianTimeToARTDiagnosis_yearSbCty medianTime',
                ])
                .andWhere('f.County IN (:...counties)', {
                    counties: query.county,
                });

            return await medianTimeToARTCountySql
                .groupBy('SubCounty, MedianTimeToARTDiagnosis_yearSbCty')
                .orderBy('f.MedianTimeToARTDiagnosis_yearSbCty', 'DESC')
                .getRawMany();
        }

        if (query.subCounty) {
            medianTimeToARTCountySql = this.repository
                .createQueryBuilder('f')
                .select([
                    'County county, MedianTimeToARTDiagnosis_yearSbCty medianTime',
                ])
                .andWhere('f.SubCounty IN (:...subCounties)', {
                    subCounties: query.subCounty,
                });


            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToARTDiagnosis_yearSbCty')
                .orderBy('f.MedianTimeToARTDiagnosis_yearSbCty', 'DESC')
                .getRawMany();
        }

        if (query.partner) {
            medianTimeToARTCountySql = this.repository
                .createQueryBuilder('f')
                .select([
                    'County county, MedianTimeToARTDiagnosis_yearPartner medianTime',
                ])
                .andWhere('f.PartnerName IN (:...partners)', {
                    partners: query.partner,
                });

            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToARTDiagnosis_yearPartner')
                .orderBy('f.MedianTimeToARTDiagnosis_yearPartner', 'DESC')
                .getRawMany();
        }

        if (query.agency) {
            medianTimeToARTCountySql = this.repository
                .createQueryBuilder('f')
                .select([
                    'County county, MedianTimeToARTDiagnosis_yearCTAgency medianTime',
                ])
                .andWhere('f.AgencyName IN (:...agencies)', {
                    agencies: query.agency,
                });

            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToARTDiagnosis_yearCTAgency')
                .orderBy('f.MedianTimeToARTDiagnosis_yearCTAgency', 'DESC')
                .getRawMany();
        }

        if (query.gender) {
            medianTimeToARTCountySql = this.repository
                .createQueryBuilder('f')
                .select(['County county, MedianTimeToART_Sex medianTime'])
                .andWhere('f.Sex IN (:...genders)', {
                    genders: query.gender,
                });

            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToART_Sex')
                .orderBy('f.MedianTimeToART_Sex', 'DESC')
                .getRawMany();
        }

        if (query.datimAgeGroup) {
            medianTimeToARTCountySql = this.repository
                .createQueryBuilder('f')
                .select([
                    'County county, MedianTimeToART_DATIM_AgeGroup medianTime',
                ])
                .andWhere('f.AgeGroup IN (:...ageGroups)', {
                    ageGroups: query.datimAgeGroup,
                });

            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToART_DATIM_AgeGroup')
                .orderBy('f.MedianTimeToART_DATIM_AgeGroup', 'DESC')
                .getRawMany();
        }


        return await medianTimeToARTCountySql
            .groupBy('County, MedianTimeToARTDiagnosis_yearCounty')
            .orderBy('f.MedianTimeToARTDiagnosis_yearCounty', 'DESC')
            .getRawMany();
    }
}
