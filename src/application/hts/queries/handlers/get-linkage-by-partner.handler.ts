import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByPartnerQuery } from '../get-linkage-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../../../entities/hts/fact-htsuptake.entity';
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

        if(query.facility) {
            linkageByPartnerSql = `${linkageByPartnerSql} and FacilityName=?`;
            params.push(query.facility);
        }

        if(query.county) {
            linkageByPartnerSql = `${linkageByPartnerSql} and County=?`;
            params.push(query.county);
        }

        if(query.subCounty) {
            linkageByPartnerSql = `${linkageByPartnerSql} and SubCounty=?`;
            params.push(query.subCounty);
        }

        if(query.partner) {
            linkageByPartnerSql = `${linkageByPartnerSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            linkageByPartnerSql = `${linkageByPartnerSql} and year=?`;
            params.push(query.year);
        }

        if(query.month) {
            linkageByPartnerSql = `${linkageByPartnerSql} and month=?`;
            params.push(query.month);
        }

        linkageByPartnerSql = `${linkageByPartnerSql} GROUP BY CTPartner`;

        return  await this.repository.query(linkageByPartnerSql, params);
    }
}
