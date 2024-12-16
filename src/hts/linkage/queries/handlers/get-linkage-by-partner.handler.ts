import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByPartnerQuery } from '../impl/get-linkage-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetLinkageByPartnerQuery)
export class GetLinkageByPartnerHandler
    implements IQueryHandler<GetLinkageByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetLinkageByPartnerQuery): Promise<any> {
        const params = [];
        let linkageByPartnerSql = this.repository.createQueryBuilder('f')
            .select([`
                PartnerName Partner,
                SUM(Tested) tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked,
                ((CAST(SUM(linked) AS FLOAT)/NULLIF(CAST(SUM(positive)AS FLOAT), 0))*100) AS linkage
            `])
            .where(`PartnerName IS NOT NULL AND positive > 0 `);

        if (query.county) {
            linkageByPartnerSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            linkageByPartnerSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            linkageByPartnerSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            linkageByPartnerSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            linkageByPartnerSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            linkageByPartnerSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            linkageByPartnerSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            linkageByPartnerSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await linkageByPartnerSql
            .groupBy('PartnerName')
            .orderBy(`SUM(Positive)`, `DESC`)
            .getRawMany();
    }
}
