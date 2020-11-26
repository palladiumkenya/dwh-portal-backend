import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageNumberPositiveQuery } from '../impl/get-linkage-number-positive.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';


@QueryHandler(GetLinkageNumberPositiveQuery)
export class GetLinkageNumberPositiveHandler implements IQueryHandler<GetLinkageNumberPositiveQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {
    }

    async execute(query: GetLinkageNumberPositiveQuery): Promise<any> {
        const params = [];
        let linkageNumberPositiveSql = 'SELECT year, month, TestedBefore,' +
            'SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, ' +
            'SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked, ' +
            '((SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END)/SUM(positive))*100) AS linkage ' +
            'FROM fact_htsuptake WHERE positive > 0 ';

        if(query.county) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }
        
        if(query.facility) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.year) {
            if(query.year == (new Date()).getFullYear()) {
                linkageNumberPositiveSql = `${linkageNumberPositiveSql} and  (YEAR >= YEAR(DATE_SUB(NOW(), INTERVAL 11 MONTH)))`;
            } else {
                linkageNumberPositiveSql = `${linkageNumberPositiveSql} and year=?`;
            }
            params.push(query.year);
        }

        if(query.month) {
            linkageNumberPositiveSql = `${linkageNumberPositiveSql} and month=?`;
            params.push(query.month);
        }

        linkageNumberPositiveSql = `${linkageNumberPositiveSql} GROUP BY TestedBefore, year, month ORDER BY year, month, TestedBefore`;

        return  await this.repository.query(linkageNumberPositiveSql, params);
    }
}
