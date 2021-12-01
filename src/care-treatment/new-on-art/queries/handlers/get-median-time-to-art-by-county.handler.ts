import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMedianTimeToArtByCountyQuery } from '../impl/get-median-time-to-art-by-county.query';
import { FactCtTimeToArtLast12M } from '../../entities/fact-ct-time-to-art-last-12-m.model';

@QueryHandler(GetMedianTimeToArtByCountyQuery)
export class GetMedianTimeToArtByCountyHandler implements IQueryHandler<GetMedianTimeToArtByCountyQuery> {
    constructor(
        @InjectRepository(FactCtTimeToArtLast12M, 'mssql')
        private readonly repository: Repository<FactCtTimeToArtLast12M>
    ) {

    }

    async execute(query: GetMedianTimeToArtByCountyQuery): Promise<any> {
        let medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
            .select(['County county, MedianTimeToART_County medianTime'])
            .where('f.[County] IS NOT NULL')
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
                .select(['SubCounty county, MedianTimeToART_SbCty medianTime'])
                .andWhere('f.County IN (:...counties)', { counties: query.county });

            return await medianTimeToARTCountySql
                .groupBy('SubCounty, MedianTimeToART_SbCty')
                .orderBy('f.MedianTimeToART_SbCty', 'DESC')
                .getRawMany();
        }

        if (query.subCounty) {
            medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
                .select(['County county, MedianTimeToART_SbCty medianTime'])
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });


            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToART_SbCty')
                .orderBy('f.MedianTimeToART_SbCty', 'DESC')
                .getRawMany();
        }

        if (query.partner) {
            medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
                .select(['County county, MedianTimeToART_Partner medianTime'])
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });

            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToART_Partner')
                .orderBy('f.MedianTimeToART_Partner', 'DESC')
                .getRawMany();
        }

        if (query.agency) {
            medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
                .select(['County county, MedianTimeToART_CTAgency medianTime'])
                .andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });

            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToART_CTAgency')
                .orderBy('f.MedianTimeToART_CTAgency', 'DESC')
                .getRawMany();
        }

        if (query.gender) {
            medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
                .select(['County county, MedianTimeToART_Gender medianTime'])
                .andWhere('f.Gender IN (:...genders)', { genders: query.gender });

            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToART_Gender')
                .orderBy('f.MedianTimeToART_Gender', 'DESC')
                .getRawMany();
        }

        if (query.datimAgeGroup) {
            medianTimeToARTCountySql = this.repository.createQueryBuilder('f')
                .select(['County county, MedianTimeToART_DATIM_AgeGroup medianTime'])
                .andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });

            return await medianTimeToARTCountySql
                .groupBy('County, MedianTimeToART_DATIM_AgeGroup')
                .orderBy('f.MedianTimeToART_DATIM_AgeGroup', 'DESC')
                .getRawMany();
        }


        return await medianTimeToARTCountySql
            .groupBy('County, MedianTimeToART_County')
            .orderBy('f.MedianTimeToART_County', 'DESC')
            .getRawMany();
    }
}
