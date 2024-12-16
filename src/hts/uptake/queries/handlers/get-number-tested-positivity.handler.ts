import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNumberTestedPositivityQuery } from '../impl/get-number-tested-positivity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../entities/aggregate-hts-uptake.model';


@QueryHandler(GetNumberTestedPositivityQuery)
export class GetNumberTestedPositivityHandler
    implements IQueryHandler<GetNumberTestedPositivityQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetNumberTestedPositivityQuery): Promise<any> {
        const params = [];
        let numberTestedPositivitySql = this.repository.createQueryBuilder('f').
            select([`year, month, TestedBefore,
                SUM(Tested) Tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked,
                ((CAST(SUM(linked) AS FLOAT)/NULLIF(CAST(SUM(positive)AS FLOAT), 0))*100) AS linkage`]);

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
            .groupBy(`TestedBefore, year, month`)
            .orderBy(`TestedBefore`).addOrderBy(`year`).addOrderBy(`month`)
            .getRawMany();
    }
}
