import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByEntryPointQuery } from '../impl/get-uptake-by-entrypoint.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSEntrypoint } from '../../../linkage/entities/aggregate-hts-entrypoint.model';

@QueryHandler(GetUptakeByEntryPointQuery)
export class GetUptakeByEntrypointHandler
    implements IQueryHandler<GetUptakeByEntryPointQuery> {
    constructor(
        @InjectRepository(AggregateHTSEntrypoint, 'mssql')
        private readonly repository: Repository<AggregateHTSEntrypoint>,
    ) {}

    async execute(query: GetUptakeByEntryPointQuery): Promise<any> {
        const params = [];
        let uptakeByEntryPointSql = this.repository.createQueryBuilder('f')
            .select([`
                EntryPoint AS EntryPoint,
                SUM(Tested) Tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                ((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity
            `])
            .where(`EntryPoint IS NOT NULL`);

        if (query.county) {
            uptakeByEntryPointSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            uptakeByEntryPointSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            uptakeByEntryPointSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            uptakeByEntryPointSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            uptakeByEntryPointSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            uptakeByEntryPointSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            uptakeByEntryPointSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            uptakeByEntryPointSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await uptakeByEntryPointSql
            .groupBy(`EntryPoint`)
            .orderBy(`SUM(Tested)`, `DESC`)
            .getRawMany();
    }
}
