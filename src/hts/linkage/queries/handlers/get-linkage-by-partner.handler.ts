import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByPartnerQuery } from '../impl/get-linkage-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetLinkageByPartnerQuery)
export class GetLinkageByPartnerHandler implements IQueryHandler<GetLinkageByPartnerQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ){}

    async execute(query: GetLinkageByPartnerQuery): Promise<any> {
        const params = [];
        let linkageByPartnerSql = 'SELECT ' +
            'CTPartner AS Partner,' +
            'SUM(CASE WHEN Positive IS NULL THEN 0 ELSE Positive END) positive, ' +
            'SUM(CASE WHEN Linked IS NULL THEN 0 ELSE Linked END) linked, ' +
            '((SUM(CASE WHEN Linked IS NULL THEN 0 ELSE Linked END)/SUM(positive))*100) AS linkage ' +
            'FROM fact_htsuptake ' +
            'WHERE CTPartner IS NOT NULL AND positive > 0 ';

        if(query.county) {
            linkageByPartnerSql = `${linkageByPartnerSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            linkageByPartnerSql = `${linkageByPartnerSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            linkageByPartnerSql = `${linkageByPartnerSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            linkageByPartnerSql = `${linkageByPartnerSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        // if(query.year) {
        //     linkageByPartnerSql = `${linkageByPartnerSql} and year=?`;
        //     params.push(query.year);
        // }

        // if(query.month) {
        //     linkageByPartnerSql = `${linkageByPartnerSql} and month=?`;
        //     params.push(query.month);
        // }

        if (query.fromDate) {
            linkageByPartnerSql = `${linkageByPartnerSql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
            params.push(query.fromDate);
        }

        if (query.toDate) {
            linkageByPartnerSql = `${linkageByPartnerSql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
            params.push(query.toDate);
        }

        linkageByPartnerSql = `${linkageByPartnerSql} GROUP BY CTPartner ORDER BY SUM(Positive) DESC`;

        return  await this.repository.query(linkageByPartnerSql, params);
    }
}
