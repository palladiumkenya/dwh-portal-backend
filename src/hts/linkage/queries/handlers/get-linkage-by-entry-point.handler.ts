import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByEntryPointQuery } from '../impl/get-linkage-by-entry-point.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSEntrypoint } from '../../entities/aggregate-hts-entrypoint.model';

@QueryHandler(GetLinkageByEntryPointQuery)
export class GetLinkageByEntryPointHandler
    implements IQueryHandler<GetLinkageByEntryPointQuery> {
    constructor(
        @InjectRepository(AggregateHTSEntrypoint, 'mssql')
        private readonly repository: Repository<AggregateHTSEntrypoint>,
    ) {}

    async execute(query: GetLinkageByEntryPointQuery): Promise<any> {
        const params = [];
        let linkageByEntryPointSql = this.repository.createQueryBuilder('f')
            .select([
                `EntryPoint entryPoint,
                SUM(Tested) tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked,
                ((CAST(SUM(linked) AS FLOAT)/NULLIF(CAST(SUM(positive)AS FLOAT), 0))*100) AS linkage`
            ])
            .where(`EntryPoint IS NOT NULL AND EntryPoint <> '' AND positive IS NOT NULL AND positive > 0 `);

        if (query.county) {
            linkageByEntryPointSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            linkageByEntryPointSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            linkageByEntryPointSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            linkageByEntryPointSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            linkageByEntryPointSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            linkageByEntryPointSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            linkageByEntryPointSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            linkageByEntryPointSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await linkageByEntryPointSql
            .groupBy('EntryPoint')
            .orderBy('SUM(positive)', 'DESC')
            .getRawMany();
    }
}
