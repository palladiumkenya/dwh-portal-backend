import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByAgeSexQuery } from '../get-uptake-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../../../entities/hts/fact-htsuptake-agegender.entity';

@QueryHandler(GetUptakeByAgeSexQuery)
export class GetUptakeByAgeSexHandler implements IQueryHandler<GetUptakeByAgeSexQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>
    ){}

    async execute(query: GetUptakeByAgeSexQuery): Promise<any> {
        const params = [];
        let uptakeByAgeSexSql = 'SELECT DATIM_AgeGroup AS AgeGroup, ' +
            'SUM(Tested) Tested, ' +
            'SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, ' +
            '((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity ' +
            'FROM fact_hts_agegender WHERE Tested IS NOT NULL ';

        if(query.county) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and County=?`;
            params.push(query.county);
        }

        if(query.month) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and month=?`;
            params.push(query.month);
        }

        if(query.partner) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and year=?`;
            params.push(query.year);
        }

        if(query.facility) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and FacilityName=?`;
            params.push(query.facility);
        }

        uptakeByAgeSexSql = `${uptakeByAgeSexSql} GROUP BY DATIM_AgeGroup`;

        return  await this.repository.query(uptakeByAgeSexSql, params);
    }
}
