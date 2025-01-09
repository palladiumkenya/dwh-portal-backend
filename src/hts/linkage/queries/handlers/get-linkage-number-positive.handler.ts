import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {GetLinkageNumberPositiveQuery} from '../impl/get-linkage-number-positive.query';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';


@QueryHandler(GetLinkageNumberPositiveQuery)
export class GetLinkageNumberPositiveHandler
    implements IQueryHandler<GetLinkageNumberPositiveQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetLinkageNumberPositiveQuery): Promise<any> {
        const params = [];
        let linkageNumberPositiveSql = this.repository.createQueryBuilder('f')
            .select([`
                year, 
                month,
                SUM(Tested) tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked,
                ((CAST(SUM(linked) AS FLOAT)/NULLIF(CAST(SUM(positive)AS FLOAT), 0))*100) AS linkage
            `])
            .where(`positive > 0`);

        if (query.county) {
            linkageNumberPositiveSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            linkageNumberPositiveSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            linkageNumberPositiveSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            linkageNumberPositiveSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            linkageNumberPositiveSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            linkageNumberPositiveSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            linkageNumberPositiveSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            linkageNumberPositiveSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await linkageNumberPositiveSql
            .groupBy('year, month')
            .orderBy('year')
            .addOrderBy('month')
            .getRawMany();
    }
}
