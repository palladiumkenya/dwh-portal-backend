import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTestedasQuery } from '../impl/get-uptake-by-testedas.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateClientTestedAs } from '../../entities/aggregate-hts-client-tested-as.model';

@QueryHandler(GetUptakeByTestedasQuery)
export class GetUptakeByTestedasHandler
    implements IQueryHandler<GetUptakeByTestedasQuery> {
    constructor(
        @InjectRepository(AggregateClientTestedAs, 'mssql')
        private readonly repository: Repository<AggregateClientTestedAs>,
    ) {}

    async execute(query: GetUptakeByTestedasQuery): Promise<any> {
        const params = [];
        let uptakeByClientTestedAsSql = this.repository.createQueryBuilder('f')
            .select([`
                ClientTestedAs AS ClientTestedAs,
                SUM(Tested)Tested, 
                SUM(Positive) Positive, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity
            `])
            .where(`ClientTestedAs IS NOT NULL`);

        if (query.county) {
            uptakeByClientTestedAsSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            uptakeByClientTestedAsSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            uptakeByClientTestedAsSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            uptakeByClientTestedAsSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            uptakeByClientTestedAsSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            uptakeByClientTestedAsSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            uptakeByClientTestedAsSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            uptakeByClientTestedAsSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await uptakeByClientTestedAsSql.groupBy(`ClientTestedAs`).getRawMany();
    }
}
