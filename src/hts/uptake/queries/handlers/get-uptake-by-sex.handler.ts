import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeBySexQuery } from '../impl/get-uptake-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../entities/aggregate-hts-uptake.model';

@QueryHandler(GetUptakeBySexQuery)
export class GetUptakeBySexHandler
    implements IQueryHandler<GetUptakeBySexQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetUptakeBySexQuery): Promise<any> {
        const params = [];

        let uptakeBySexSql = this.repository
            .createQueryBuilder('q')
            .select(
                `Gender gender, 
                SUM(Tested) tested, 
                SUM(Positive) positive, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity`
            )
            .where(`Tested > 0`)

        if (query.county) {
            uptakeBySexSql.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            uptakeBySexSql.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            uptakeBySexSql.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }


        if (query.partner) {
            uptakeBySexSql.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        // if(query.month) {
        //     uptakeBySexSql = `${uptakeBySexSql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     uptakeBySexSql = `${uptakeBySexSql} and year=?`;
        //     params.push(query.year);
        // }

        if (query.fromDate) {
            let year = `${query.fromDate}`.substring(0, 4); // Extract year
            let month = `${query.fromDate}`.substring(4, 6); // Extract month
            let formattedDate = `${year}-${month}-01`;
            uptakeBySexSql.andWhere('AsOfDate >= :fromDate', { fromDate: formattedDate });
        }

        if (query.toDate) {
            let toDate = `${query.toDate}`;
            let year = toDate.substring(0, 4);
            let month = toDate.substring(4, 6);
            let formattedDate = `${year}-${month}-01`;
            uptakeBySexSql.andWhere('AsOfDate <=  EOMONTH(:toDate)', { toDate: formattedDate });
        }

        return await uptakeBySexSql
            .groupBy('Gender')
            .getRawMany();
    }
}
