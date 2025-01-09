import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByAgeSexQuery } from '../impl/get-linkage-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetLinkageByAgeSexQuery)
export class GetLinkageByAgeSexHandler
    implements IQueryHandler<GetLinkageByAgeSexQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetLinkageByAgeSexQuery): Promise<any> {
        const params = [];
        let linkageByAgeSexSql = this.repository.createQueryBuilder('f')
            .select([
                `AgeGroup,
                Gender,
                SUM(Tested) Tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked,
                ((CAST(SUM(linked) AS FLOAT)/NULLIF(CAST(SUM(positive)AS FLOAT), 0))*100) AS linkage`
            ])
            .where('positive > 0');

        if (query.county) {
            linkageByAgeSexSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            linkageByAgeSexSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            linkageByAgeSexSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            linkageByAgeSexSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        // if(query.year) {
        //     linkageByAgeSexSql = `${linkageByAgeSexSql} and year=?`;
        //     params.push(query.year);
        // }

        // if(query.month) {
        //     linkageByAgeSexSql = `${linkageByAgeSexSql} and month=?`;
        //     params.push(query.month);
        // }

        if (query.fromDate) {
            linkageByAgeSexSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            linkageByAgeSexSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            linkageByAgeSexSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            linkageByAgeSexSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await linkageByAgeSexSql
            .groupBy('AgeGroup, Gender')
            .getRawMany();
    }
}
