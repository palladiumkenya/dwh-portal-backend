import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageNumberPositiveByTypeQuery } from '../impl/get-linkage-number-positive-by-type.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';


@QueryHandler(GetLinkageNumberPositiveByTypeQuery)
export class GetLinkageNumberPositiveByTypeHandler implements IQueryHandler<GetLinkageNumberPositiveByTypeQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {

    }

    async execute(query: GetLinkageNumberPositiveByTypeQuery): Promise<any> {
        const params = [];
        let linkageNumberPositiveByTypeSql = 'SELECT year, month, TestedBefore,' +
            'SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, ' +
            'SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked, ' +
            '((SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END)/SUM(positive))*100) AS linkage ' +
            'FROM fact_htsuptake WHERE positive > 0 ';

        if(query.county) {
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.year) {
            if(query.year == (new Date()).getFullYear()) {
                linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and  (YEAR >= YEAR(DATE_SUB(NOW(), INTERVAL 11 MONTH)))`;
            } else {
                linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and year=?`;
            }
            params.push(query.year);
        }

        if(query.month) {
            linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} and month=?`;
            params.push(query.month);
        }

        linkageNumberPositiveByTypeSql = `${linkageNumberPositiveByTypeSql} GROUP BY TestedBefore, year, month`;

        return  await this.repository.query(linkageNumberPositiveByTypeSql, params);
    }
}
