import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetVlMedianTimeToFirstVlByYearQuery } from '../impl/get-vl-median-time-to-first-vl-by-year.query';
import { FactCtTimeToFirstVl } from '../../entities/fact-ct-time-to-first-vl.model';

@QueryHandler(GetVlMedianTimeToFirstVlByYearQuery)
export class GetVlMedianTimeToFirstVlByYearHandler implements IQueryHandler<GetVlMedianTimeToFirstVlByYearQuery> {
    constructor(
        @InjectRepository(FactCtTimeToFirstVl, 'mssql')
        private readonly repository: Repository<FactCtTimeToFirstVl>
    ) {

    }

    async execute(query: GetVlMedianTimeToFirstVlByYearQuery): Promise<any> {
        let medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
            .select(['distinct StartYr year, MedianTimeToFirstVL_year medianTime'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['DISTINCT StartYr year, MedianTimeToFirstVL_yearCounty medianTime'])
                .andWhere('f.County = :County', { County: query.county });

            return await medianTimeToFirstVlSql
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.subCounty) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['DISTINCT StartYr year, MedianTimeToFirstVL_yearSbCty medianTime'])
                .andWhere('f.SubCounty = :SubCounty', { SubCounty: query.subCounty });

            return await medianTimeToFirstVlSql
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.facility) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['DISTINCT StartYr year, MedianTimeToFirstVL_yearFacility medianTime'])
                .andWhere('f.FacilityName = :FacilityName', { FacilityName: query.facility });

            return await medianTimeToFirstVlSql
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.partner) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['DISTINCT StartYr year, MedianTimeToFirstVL_yearPartner medianTime'])
                .andWhere('f.CTPartner = :CTPartner', { CTPartner: query.partner });

            return await medianTimeToFirstVlSql
                .orderBy('f.StartYr')
                .getRawMany();
        }

        return await medianTimeToFirstVlSql
            .orderBy('f.StartYr')
            .getRawMany();
    }
}
