import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTestingStrategyQuery } from '../impl/get-uptake-by-testing-strategy.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../entities/aggregate-hts-uptake.model';
import { AggregateHTSTestStrategy } from '../../../linkage/entities/aggregate-hts-strategy.model';

@QueryHandler(GetUptakeByTestingStrategyQuery)
export class GetUptakeByTestingStrategyHandler
    implements IQueryHandler<GetUptakeByTestingStrategyQuery> {
    constructor(
        @InjectRepository(AggregateHTSTestStrategy, 'mssql')
        private readonly repository: Repository<AggregateHTSTestStrategy>,
    ) {}

    async execute(query: GetUptakeByTestingStrategyQuery): Promise<any> {
        const params = [];
        let uptakeByPopulationTypeSql =  this.repository.createQueryBuilder('f')
            .select([`
                TestStrategy AS TestStrategy,
                SUM(TestedClients)Tested, 
                SUM(PositiveClients) Positive, 
                ((CAST(SUM(CASE WHEN positiveClients IS NULL THEN 0 ELSE positiveClients END) AS FLOAT)/CAST(SUM(TestedClients) AS FLOAT))*100) AS positivity
            `])
            .where(`TestStrategy IS NOT NULL`);

        if (query.county) {
            uptakeByPopulationTypeSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            uptakeByPopulationTypeSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            uptakeByPopulationTypeSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            uptakeByPopulationTypeSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            uptakeByPopulationTypeSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            uptakeByPopulationTypeSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            uptakeByPopulationTypeSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            uptakeByPopulationTypeSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await uptakeByPopulationTypeSql.groupBy(`TestStrategy`).orderBy(`SUM(TestedClients)`, `DESC`).getRawMany()
    }
}
