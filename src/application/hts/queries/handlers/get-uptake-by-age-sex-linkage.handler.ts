import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByAgeSexLinkageQuery } from '../get-uptake-by-age-sex-linkage.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../../../entities/hts/fact-htsuptake-agegender.entity';

@QueryHandler(GetUptakeByAgeSexLinkageQuery)
export class GetUptakeByAgeSexLinkageHandler implements IQueryHandler<GetUptakeByAgeSexLinkageQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>
    ){}

    async execute(query: GetUptakeByAgeSexLinkageQuery): Promise<any> {
        const params = [];
        let uptakeByAgeSexLinkageSql = 'SELECT DATIM_AgeGroup AS AgeGroup, ' +
            'Gender, ' +
            'SUM(Tested) tested, ' +
            'SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, ' +
            'SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked, ' +
            '((SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END)/SUM(positive))*100) AS linkage ' +
            'FROM fact_hts_agegender WHERE positive > 0 ';

        if(query.facility) {
            uptakeByAgeSexLinkageSql = `${uptakeByAgeSexLinkageSql} and FacilityName=?`;
            params.push(query.facility);
        }

        if(query.county) {
            uptakeByAgeSexLinkageSql = `${uptakeByAgeSexLinkageSql} and County=?`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByAgeSexLinkageSql = `${uptakeByAgeSexLinkageSql} and SubCounty=?`;
            params.push(query.subCounty);
        }

        if(query.partner) {
            uptakeByAgeSexLinkageSql = `${uptakeByAgeSexLinkageSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            uptakeByAgeSexLinkageSql = `${uptakeByAgeSexLinkageSql} and year=?`;
            params.push(query.year);
        }

        if(query.month) {
            uptakeByAgeSexLinkageSql = `${uptakeByAgeSexLinkageSql} and month=?`;
            params.push(query.month);
        }

        uptakeByAgeSexLinkageSql = `${uptakeByAgeSexLinkageSql} GROUP BY DATIM_AgeGroup, Gender`;

        return  await this.repository.query(uptakeByAgeSexLinkageSql, params);
    }
}
