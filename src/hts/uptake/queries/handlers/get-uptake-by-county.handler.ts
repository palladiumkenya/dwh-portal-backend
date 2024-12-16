import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByCountyQuery } from '../impl/get-uptake-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../entities/aggregate-hts-uptake.model';

@QueryHandler(GetUptakeByCountyQuery)
export class GetUptakeByCountyHandler
    implements IQueryHandler<GetUptakeByCountyQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetUptakeByCountyQuery): Promise<any> {
        const params = [];
        let uptakeByCountySql = null;

        if (query.county) {
            uptakeByCountySql = this.repository.createQueryBuilder('f')
                .select([`
                    SubCounty AS County,
                    SUM(Tested) Tested,
                    SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                    ((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity
                `])
                .where(`SubCounty IS NOT NULL`);
        } else {
            uptakeByCountySql = this.repository.createQueryBuilder('f')
                .select([`
                    County AS County,
                    SUM(Tested) Tested,
                    SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                    ((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity
                `])
                .where(`County IS NOT NULL`);
        }


        if (query.county) {
            uptakeByCountySql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            uptakeByCountySql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            uptakeByCountySql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            uptakeByCountySql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            uptakeByCountySql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            uptakeByCountySql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            uptakeByCountySql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            uptakeByCountySql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        if (query.county) {
            uptakeByCountySql = await uptakeByCountySql.groupBy(`SubCounty`);
        } else {
            uptakeByCountySql =  await uptakeByCountySql.groupBy(`County`);
        }

        return await uptakeByCountySql
            .orderBy(`SUM(Tested)`, `DESC`)
            .getRawMany();
    }
}
