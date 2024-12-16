import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByStrategyQuery } from '../impl/get-linkage-by-strategy.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSTestStrategy } from '../../entities/aggregate-hts-strategy.model';

@QueryHandler(GetLinkageByStrategyQuery)
export class GetLinkageByStrategyHandler
    implements IQueryHandler<GetLinkageByStrategyQuery> {
    constructor(
        @InjectRepository(AggregateHTSTestStrategy, 'mssql')
        private readonly repository: Repository<AggregateHTSTestStrategy>,
    ) {}

    async execute(query: GetLinkageByStrategyQuery): Promise<any> {
        const params = [];
        let linkageByStrategySql = this.repository.createQueryBuilder('f')
            .select([`
                CASE WHEN TestStrategy = 'NP: HTS for non-patients ' THEN 'NP:HTS for Non-Patient' ELSE TestStrategy END AS TestStrategy,
                SUM(TestedClients) tested,
                SUM(CASE WHEN positiveClients IS NULL THEN 0 ELSE positiveClients END) positive,
                SUM(CASE WHEN linkedClients IS NULL THEN 0 ELSE linkedClients END) linked,
                ((CAST(SUM(linkedClients) AS FLOAT)/NULLIF(CAST(SUM(positiveClients)AS FLOAT), 0))*100) AS linkage
            `])
            .where(`TestStrategy IS NOT NULL AND TestStrategy <> 'NULL' AND positiveClients > 0`);

        if (query.county) {
            linkageByStrategySql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            linkageByStrategySql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            linkageByStrategySql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            linkageByStrategySql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            linkageByStrategySql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            linkageByStrategySql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            linkageByStrategySql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            linkageByStrategySql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await linkageByStrategySql
            .groupBy('TestStrategy')
            .orderBy(`SUM(positiveClients)`, `DESC`)
            .getRawMany();
    }
}
