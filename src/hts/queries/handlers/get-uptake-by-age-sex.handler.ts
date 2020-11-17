import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByAgeSexQuery } from '../impl/get-uptake-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../entities/fact-htsuptake-agegender.entity';

@QueryHandler(GetUptakeByAgeSexQuery)
export class GetUptakeByAgeSexHandler implements IQueryHandler<GetUptakeByAgeSexQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>
    ){}

    async execute(query: GetUptakeByAgeSexQuery): Promise<any> {
        const params = [];
        let uptakeByAgeSexSql = 'SELECT DATIM_AgeGroup AS AgeGroup, Gender, ' +
            'SUM(Tested) Tested ' +
            'FROM fact_hts_agegender WHERE Tested IS NOT NULL ';

        if(query.county) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.month) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and month=?`;
            params.push(query.month);
        }

        if(query.year) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and year=?`;
            params.push(query.year);
        }

        uptakeByAgeSexSql = `${uptakeByAgeSexSql} GROUP BY DATIM_AgeGroup, Gender`;
        return  await this.repository.query(uptakeByAgeSexSql, params);
    }
}
