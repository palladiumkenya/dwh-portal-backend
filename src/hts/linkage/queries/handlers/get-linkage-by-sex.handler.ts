import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageBySexQuery } from '../impl/get-linkage-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetLinkageBySexQuery)
export class GetLinkageBySexHandler
    implements IQueryHandler<GetLinkageBySexQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetLinkageBySexQuery): Promise<any> {
        const params = [];
        let linkageBySexSql = this.repository.createQueryBuilder('f')
            .select([`
                gender,
                SUM(Tested) tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked,
                ((CAST(SUM(linked) AS FLOAT)/NULLIF(CAST(SUM(positive)AS FLOAT), 0))*100) AS linkage
            `])
            .where(`positive > 0`);

        if (query.county) {
            linkageBySexSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            linkageBySexSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            linkageBySexSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            linkageBySexSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            linkageBySexSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            linkageBySexSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            linkageBySexSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            linkageBySexSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await linkageBySexSql
            .groupBy('Gender')
            .getRawMany();
    }
}
