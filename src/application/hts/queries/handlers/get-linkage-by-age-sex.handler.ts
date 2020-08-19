import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByAgeSexQuery } from '../get-linkage-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../../../entities/hts/fact-htsuptake-agegender.entity';

@QueryHandler(GetLinkageByAgeSexQuery)
export class GetLinkageByAgeSexHandler implements IQueryHandler<GetLinkageByAgeSexQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>
    ){}

    async execute(query: GetLinkageByAgeSexQuery): Promise<any> {
        const params = [];
        let linkageByAgeSexSql = 'SELECT DATIM_AgeGroup AS AgeGroup, ' +
            'Gender, ' +
            'SUM(Tested) tested, ' +
            'SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, ' +
            'SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked, ' +
            '((SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END)/SUM(positive))*100) AS linkage ' +
            'FROM fact_hts_agegender WHERE positive > 0 ';

        if(query.facility) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and FacilityName=?`;
            params.push(query.facility);
        }

        if(query.county) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and County=?`;
            params.push(query.county);
        }

        if(query.subCounty) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and SubCounty=?`;
            params.push(query.subCounty);
        }

        if(query.partner) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and year=?`;
            params.push(query.year);
        }

        if(query.month) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and month=?`;
            params.push(query.month);
        }

        linkageByAgeSexSql = `${linkageByAgeSexSql} GROUP BY DATIM_AgeGroup, Gender`;

        return  await this.repository.query(linkageByAgeSexSql, params);
    }
}
