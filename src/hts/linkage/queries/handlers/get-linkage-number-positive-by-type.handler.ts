import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageNumberPositiveByTypeQuery } from '../impl/get-linkage-number-positive-by-type.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';


@QueryHandler(GetLinkageNumberPositiveByTypeQuery)
export class GetLinkageNumberPositiveByTypeHandler
    implements IQueryHandler<GetLinkageNumberPositiveByTypeQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetLinkageNumberPositiveByTypeQuery): Promise<any> {
        const params = [];
        let linkageNumberPositiveByTypeSql = this.repository.createQueryBuilder('f')
            .select([`
                year, month, TestedBefore,
                SUM(Tested) tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked,
                ((CAST(SUM(linked) AS FLOAT)/NULLIF(CAST(SUM(positive)AS FLOAT), 0))*100) AS linkage
            `])
            .where(`positive > 0`);

        if (query.county) {
            linkageNumberPositiveByTypeSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            linkageNumberPositiveByTypeSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            linkageNumberPositiveByTypeSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            linkageNumberPositiveByTypeSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            linkageNumberPositiveByTypeSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            linkageNumberPositiveByTypeSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            linkageNumberPositiveByTypeSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            linkageNumberPositiveByTypeSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await linkageNumberPositiveByTypeSql
            .groupBy(`year, month, TestedBefore`)
            .orderBy(`TestedBefore`).addOrderBy(`year`).addOrderBy(`month`)
            .getRawMany()
    }
}
