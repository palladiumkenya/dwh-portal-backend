import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByPositivityQuery } from '../impl/get-uptake-by-positivity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../entities/aggregate-hts-uptake.model';

@QueryHandler(GetUptakeByPositivityQuery)
export class GetUptakeByPositivityHandler
    implements IQueryHandler<GetUptakeByPositivityQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetUptakeByPositivityQuery): Promise<any> {
        const params = [];
        let numberTestedPositivitySql = this.repository.createQueryBuilder('f')
            .select([`
                YEAR,
                MONTH, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity
            `])
            .where(`Tested > 0`);

        if (query.county) {
            numberTestedPositivitySql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            numberTestedPositivitySql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            numberTestedPositivitySql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            numberTestedPositivitySql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            numberTestedPositivitySql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            numberTestedPositivitySql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            numberTestedPositivitySql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            numberTestedPositivitySql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await numberTestedPositivitySql
            .groupBy(`year, month`)
            .getRawMany();
    }
}
