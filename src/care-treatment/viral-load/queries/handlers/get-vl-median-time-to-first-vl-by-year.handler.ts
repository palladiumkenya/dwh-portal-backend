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
        const medianTimeToFirstVlSql = this.repository.createQueryBuilder('f')
            .select(['distinct StartYr year, MedianTimeToFirstVL_year medianTime'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToFirstVlSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            medianTimeToFirstVlSql.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            medianTimeToFirstVlSql.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            medianTimeToFirstVlSql.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await medianTimeToFirstVlSql
            .orderBy('f.StartYr')
            .getRawMany();
    }
}
