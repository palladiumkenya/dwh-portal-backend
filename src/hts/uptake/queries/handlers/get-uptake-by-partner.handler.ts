import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByPartnerQuery } from '../impl/get-uptake-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../entities/aggregate-hts-uptake.model';

@QueryHandler(GetUptakeByPartnerQuery)
export class GetUptakeByPartnerHandler
    implements IQueryHandler<GetUptakeByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetUptakeByPartnerQuery): Promise<any> {
        const params = [];
        let uptakeByPartnerSql = this.repository.createQueryBuilder('f')
            .select([`
                PartnerName AS Partner,
                SUM(Tested) Tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                ((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity
            `])
            .where(`Tested > 0`);

        if (query.county) {
            uptakeByPartnerSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            uptakeByPartnerSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            uptakeByPartnerSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            uptakeByPartnerSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            uptakeByPartnerSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            uptakeByPartnerSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            uptakeByPartnerSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            uptakeByPartnerSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        return await uptakeByPartnerSql
            .groupBy(`PartnerName`)
            .orderBy(`SUM(Tested)`, `DESC`)
            .getRawMany();
    }
}
