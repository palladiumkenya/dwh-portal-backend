import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetVlMedianTimeToFirstVlByCountyQuery } from '../impl/get-vl-median-time-to-first-vl-by-county.query';
import { FactTimeToVlLast12M } from '../../entities/fact-time-to-vl-last-12m.model';

@QueryHandler(GetVlMedianTimeToFirstVlByCountyQuery)
export class GetVlMedianTimeToFirstVlByCountyHandler implements IQueryHandler<GetVlMedianTimeToFirstVlByCountyQuery> {
    constructor(
        @InjectRepository(FactTimeToVlLast12M, 'mssql')
        private readonly repository: Repository<FactTimeToVlLast12M>
    ) {

    }

    async execute(query: GetVlMedianTimeToFirstVlByCountyQuery): Promise<any> {
        let medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
            .select(['County, MedianTimeToFirstVL_County medianTime'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['SubCounty County, MedianTimeToFirstVL_SbCty medianTime'])
                .andWhere('f.County = :County', { County: query.county });

            return await medianTimeToFirstVlSql
                .groupBy('SubCounty, MedianTimeToFirstVL_SbCty')
                .orderBy('f.MedianTimeToFirstVL_SbCty', 'DESC')
                .getRawMany();
        }

        if (query.subCounty) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['County County, MedianTimeToFirstVL_County medianTime'])
                .andWhere('f.SubCounty = :SubCounty', { SubCounty: query.subCounty });


            return await medianTimeToFirstVlSql
                .groupBy('County, MedianTimeToFirstVL_County')
                .orderBy('f.MedianTimeToFirstVL_County', 'DESC')
                .getRawMany();
        }

        if (query.partner) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['County County, MedianTimeToFirstVL_County medianTime'])
                .andWhere('f.CTPartner = :Partner', { Partner: query.partner });

            return await medianTimeToFirstVlSql
                .groupBy('County, MedianTimeToFirstVL_County')
                .orderBy('f.MedianTimeToFirstVL_County', 'DESC')
                .getRawMany();
        }


        return await medianTimeToFirstVlSql
            .groupBy('County, MedianTimeToFirstVL_County')
            .orderBy('f.MedianTimeToFirstVL_County', 'DESC')
            .getRawMany();
    }
}
