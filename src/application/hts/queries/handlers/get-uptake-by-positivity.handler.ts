import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByPositivityQuery } from '../get-uptake-by-positivity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../../../entities/hts/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByPositivityQuery)
export class GetUptakeByPositivityHandler implements IQueryHandler<GetUptakeByPositivityQuery>  {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {}

    async execute(query: GetUptakeByPositivityQuery): Promise<any> {
        const params = [];
        let numberTestedPositivitySql = 'SELECT \n' +
            'YEAR,\n' +
            'MONTH, \n' +
            '((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity \n' +
            'FROM fact_htsuptake WHERE Tested IS NOT NULL ';

        if(query.county) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and County=?`;
            params.push(query.county);
        }

        if(query.month) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and month=?`;
            params.push(query.month);
        }

        if(query.partner) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and CTPartner=?`;
            params.push(query.partner);
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

        if(query.facility) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and FacilityName=?`;
            params.push(query.facility);
        }

        numberTestedPositivitySql = `${numberTestedPositivitySql} GROUP BY year,month`;

        return await this.repository.query(numberTestedPositivitySql, params);
    }
}
