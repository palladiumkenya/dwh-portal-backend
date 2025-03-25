import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetVlMedianTimeToFirstVlByYearQuery } from '../impl/get-vl-median-time-to-first-vl-by-year.query';
import { AggregateTimeToVL } from '../../entities/aggregate-time-to-vl.model';

@QueryHandler(GetVlMedianTimeToFirstVlByYearQuery)
export class GetVlMedianTimeToFirstVlByYearHandler implements IQueryHandler<GetVlMedianTimeToFirstVlByYearQuery> {
    constructor(
        @InjectRepository(AggregateTimeToVL, 'mssql')
        private readonly repository: Repository<AggregateTimeToVL>
    ) {
    }

    async execute(query: GetVlMedianTimeToFirstVlByYearQuery): Promise<any> {
        let medianTimeToFirstVlSql = this.repository
            .createQueryBuilder('f')
            .select(['StartYr year, MedianTimeToFirstVL_year medianTime'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToFirstVL_year medianTime'])
                .andWhere('f.County IN (:...counties)', { counties: query.county });

            return await medianTimeToFirstVlSql
                .groupBy('StartYr, MedianTimeToFirstVL_year')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.county && query.partner) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToFirstVL_yearCountyPartner medianTime'])
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner })
                .andWhere('f.County IN (:...counties)', { counties: query.county });

            return await medianTimeToFirstVlSql
                .groupBy('StartYr, MedianTimeToFirstVL_yearCountyPartner')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.subCounty) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToFirstVL_yearSbCty medianTime'])
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });

            return await medianTimeToFirstVlSql
                .groupBy('StartYr, MedianTimeToFirstVL_yearSbCty')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.facility) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToFirstVL_yearFacility medianTime'])
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });

            return await medianTimeToFirstVlSql
                .groupBy('StartYr, MedianTimeToFirstVL_yearFacility')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.partner) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToFirstVL_year medianTime'])
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });

            return await medianTimeToFirstVlSql
                .groupBy('StartYr, MedianTimeToFirstVL_year')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.agency) {
            medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
                .select(['StartYr year, MedianTimeToFirstVL_year medianTime'])
                .andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });

            return await medianTimeToFirstVlSql
                .groupBy('StartYr, MedianTimeToFirstVL_year')
                .orderBy('f.StartYr')
                .getRawMany();
        }

        if (query.datimAgeGroup) {
            medianTimeToFirstVlSql.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            medianTimeToFirstVlSql.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await medianTimeToFirstVlSql
            .groupBy('StartYr, MedianTimeToFirstVL_year')
            .orderBy('f.StartYr')
            .getRawMany();
    }
}
