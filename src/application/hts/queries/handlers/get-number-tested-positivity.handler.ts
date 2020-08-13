import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNumberTestedPositivityQuery } from '../get-number-tested-positivity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../../../entities/hts/fact-htsuptake.entity';
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
        let numberTestedPositivitySql = 'SELECT year,month, SUM(Tested) Tested, ' +
            'SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, ' +
            '((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity ' +
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
            numberTestedPositivitySql = `${numberTestedPositivitySql} and year=?`;
            params.push(query.year);
        }

        if(query.facility) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and FacilityName=?`;
            params.push(query.facility);
        }

        numberTestedPositivitySql = `${numberTestedPositivitySql} GROUP BY year,month`;

        return  await this.repository.query(numberTestedPositivitySql, params);
    }
}
