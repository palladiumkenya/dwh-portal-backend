import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTestedasQuery } from '../impl/get-uptake-by-testedas.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsClientTestedAs } from '../../entities/fact-hts-clienttestedas.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByTestedasQuery)
export class GetUptakeByTestedasHandler implements IQueryHandler<GetUptakeByTestedasQuery>{
    constructor(
        @InjectRepository(FactHtsClientTestedAs)
        private readonly repository: Repository<FactHtsClientTestedAs>
    ){}

    async execute(query: GetUptakeByTestedasQuery): Promise<any> {
        const params = [];
        let uptakeByClientTestedAsSql = 'SELECT \n' +
            '`ClientTestedAs` AS ClientTestedAs,\n' +
            'SUM(`Tested`) Tested, \n' +
            'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
            '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity \n' +
            '\n' +
            'FROM `fact_hts_clienttestedas`\n' +
            'WHERE `ClientTestedAs` IS NOT NULL ';

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

        uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} GROUP BY ClientTestedAs`;

        return  await this.repository.query(uptakeByClientTestedAsSql, params);
    }
}
