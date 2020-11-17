import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTbScreeningQuery } from '../impl/get-uptake-by-tb-screening.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsTBScreening } from '../../entities/fact-hts-tbscreening.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByTbScreeningQuery)
export class GetUptakeByTBScreeningHandler implements IQueryHandler<GetUptakeByTbScreeningQuery> {
    constructor(
        @InjectRepository(FactHtsTBScreening)
        private readonly repository: Repository<FactHtsTBScreening>
    ) {}

    async execute(query: GetUptakeByTbScreeningQuery): Promise<any> {
        const params = [];
        let uptakeByClientTestedAsSql = 'SELECT `tbScreening` AS tbScreeningOutcomes,\n' +
            'SUM(`Tested`) Tested, \n' +
            'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
            '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity \n' +
            'FROM `fact_hts_tbscreening`\n' +
            'WHERE `tbScreening` IS NOT NULL ';

        if(query.county) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and County=?`;
            params.push(query.county);
        }

        if(query.month) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and month=?`;
            params.push(query.month);
        }

        if(query.partner) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and year=?`;
            params.push(query.year);
        }

        if(query.facility) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and FacilityName=?`;
            params.push(query.facility);
        }

        uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} GROUP BY tbScreening`;

        return  await this.repository.query(uptakeByClientTestedAsSql, params);
    }
}
