import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNumberTestedPositivityQuery } from '../impl/get-number-tested-positivity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';


@QueryHandler(GetNumberTestedPositivityQuery)
export class GetNumberTestedPositivityHandler implements IQueryHandler<GetNumberTestedPositivityQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {
    }

    async execute(query: GetNumberTestedPositivityQuery): Promise<any> {
        const params = [];
        let numberTestedPositivitySql = 'SELECT year,month, SUM(Tested) Tested, TestedBefore, ' +
            'SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, ' +
            '((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity ' +
            'FROM fact_htsuptake WHERE Tested IS NOT NULL ';

        if(query.county) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.month) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and month=?`;
            params.push(query.month);
        }

        if(query.year) {
            const dateVal = new Date();
            const yearVal = dateVal.getFullYear();

            if(query.year == yearVal) {
                numberTestedPositivitySql = `${numberTestedPositivitySql} and  (YEAR >= YEAR(DATE_SUB(NOW(), INTERVAL 11 MONTH)))`;
            } else {
                numberTestedPositivitySql = `${numberTestedPositivitySql} and year=?`;
            }

            params.push(query.year);
        }

        numberTestedPositivitySql = `${numberTestedPositivitySql} GROUP BY TestedBefore, year,month`;

        numberTestedPositivitySql = `${numberTestedPositivitySql} ORDER BY TestedBefore, year,month`;

        return await this.repository.query(numberTestedPositivitySql, params);
    }
}
