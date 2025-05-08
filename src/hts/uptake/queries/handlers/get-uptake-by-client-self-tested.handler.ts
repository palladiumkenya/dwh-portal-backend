import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByClientSelfTestedQuery } from '../impl/get-uptake-by-client-self-tested.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateClientSelfTested } from '../../entities/aggregate-hts-client-self-tested.model';

@QueryHandler(GetUptakeByClientSelfTestedQuery)
export class GetUptakeByClientSelfTestedHandler
    implements IQueryHandler<GetUptakeByClientSelfTestedQuery> {
    constructor(
        @InjectRepository(AggregateClientSelfTested, 'mssql')
        private readonly repository: Repository<AggregateClientSelfTested>,
    ) {}

    async execute(query: GetUptakeByClientSelfTestedQuery): Promise<any> {
        const params = [];
        let uptakeByClientSelfTestedSql = this.repository.createQueryBuilder('f')
            .select([`
                CASE WHEN ClientSelfTested >= 1 THEN 'Yes' WHEN ClientSelfTested = 0 THEN 'No' else CAST(ClientSelfTested AS VARCHAR) END ClientSelfTested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity 
            `])
            .where(`ClientSelfTested is not null and Tested > 0 `);


        if (query.county) {
            uptakeByClientSelfTestedSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            uptakeByClientSelfTestedSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            uptakeByClientSelfTestedSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            uptakeByClientSelfTestedSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            uptakeByClientSelfTestedSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            uptakeByClientSelfTestedSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            uptakeByClientSelfTestedSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            uptakeByClientSelfTestedSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await uptakeByClientSelfTestedSql
            .groupBy('CASE WHEN ClientSelfTested >= 1 THEN \'Yes\' WHEN ClientSelfTested = 0 THEN \'No\' else CAST(ClientSelfTested AS VARCHAR) END')
            .getRawMany()
    }
}
