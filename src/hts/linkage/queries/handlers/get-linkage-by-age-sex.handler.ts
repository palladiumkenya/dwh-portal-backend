import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByAgeSexQuery } from '../impl/get-linkage-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../entities/fact-htsuptake-agegender.entity';

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

        if(query.county) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and CTPartner IN (?)`;
            params.push(query.partner);
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
            linkageByAgeSexSql = `${linkageByAgeSexSql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
            params.push(query.fromDate);
        }

        if (query.toDate) {
            linkageByAgeSexSql = `${linkageByAgeSexSql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
            params.push(query.toDate);
        }

        linkageByAgeSexSql = `${linkageByAgeSexSql} GROUP BY DATIM_AgeGroup, Gender`;

        return  await this.repository.query(linkageByAgeSexSql, params);
    }
}
