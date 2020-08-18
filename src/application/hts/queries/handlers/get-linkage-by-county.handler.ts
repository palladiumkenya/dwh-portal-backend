import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByCountyQuery } from '../get-linkage-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../../../entities/hts/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetLinkageByCountyQuery)
export class GetLinkageByCountyHandler implements IQueryHandler<GetLinkageByCountyQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ){}

    async execute(query: GetLinkageByCountyQuery): Promise<any> {
        const params = [];
        let linkageByCountySql = 'SELECT ' +
            'County AS County, ' +
            'SUM(CASE WHEN Tested IS NULL THEN 0 ELSE Tested END) tested, ' +
            'SUM(CASE WHEN Positive IS NULL THEN 0 ELSE Positive END) positive, ' +
            'SUM(CASE WHEN Linked IS NULL THEN 0 ELSE Linked END) linked, ' +
            '((SUM(CASE WHEN Linked IS NULL THEN 0 ELSE Linked END)/SUM(positive))*100) AS linkage ' +
            'FROM fact_htsuptake ' +
            'WHERE County IS NOT NULL AND positive > 0 ';

        if(query.facility) {
            linkageByCountySql = `${linkageByCountySql} and FacilityName=?`;
            params.push(query.facility);
        }

        if(query.county) {
            linkageByCountySql = `${linkageByCountySql} and County=?`;
            params.push(query.county);
        }

        if(query.subCounty) {
            linkageByCountySql = `${linkageByCountySql} and SubCounty=?`;
            params.push(query.county);
        }

        if(query.partner) {
            linkageByCountySql = `${linkageByCountySql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            linkageByCountySql = `${linkageByCountySql} and year=?`;
            params.push(query.year);
        }

        if(query.month) {
            linkageByCountySql = `${linkageByCountySql} and month=?`;
            params.push(query.month);
        }

        linkageByCountySql = `${linkageByCountySql} GROUP BY County`;

        return  await this.repository.query(linkageByCountySql, params);
    }
}
