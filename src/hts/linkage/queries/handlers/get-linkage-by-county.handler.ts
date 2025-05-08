import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByCountyQuery } from '../impl/get-linkage-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetLinkageByCountyQuery)
export class GetLinkageByCountyHandler
    implements IQueryHandler<GetLinkageByCountyQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetLinkageByCountyQuery): Promise<any> {
        const params = [];
        let linkageByCountySql = this.repository.createQueryBuilder('f')
            .select([`
                County,
                SUM(Tested) tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked,
                ((CAST(SUM(linked) AS FLOAT)/NULLIF(CAST(SUM(positive)AS FLOAT), 0))*100) AS linkage
            `])
            .where('positive > 0');

        if (query.county) {
            linkageByCountySql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            linkageByCountySql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            linkageByCountySql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            linkageByCountySql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            linkageByCountySql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            linkageByCountySql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            linkageByCountySql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            linkageByCountySql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await linkageByCountySql
            .groupBy('County')
            .orderBy('SUM(Positive)', 'DESC')
            .getRawMany();
    }
}
