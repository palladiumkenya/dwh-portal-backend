import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNumberPositiveLinkedQuery } from '../get-number-positive-linked.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../../../entities/hts/fact-htsuptake.entity';
import { Repository } from 'typeorm';


@QueryHandler(GetNumberPositiveLinkedQuery)
export class GetNumberPositiveLinkedHandler implements IQueryHandler<GetNumberPositiveLinkedQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {
    }

    async execute(query: GetNumberPositiveLinkedQuery): Promise<any> {
        const params = [];
        let numberPositiveLinkedSql = 'SELECT year, month, SUM(Tested) tested, ' +
            'SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, ' +
            'SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked, ' +
            '((SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END)/SUM(positive))*100) AS linkage ' +
            'FROM fact_htsuptake WHERE positive > 0 ';

        if(query.facility) {
            numberPositiveLinkedSql = `${numberPositiveLinkedSql} and FacilityName=?`;
            params.push(query.facility);
        }

        if(query.county) {
            numberPositiveLinkedSql = `${numberPositiveLinkedSql} and County=?`;
            params.push(query.county);
        }

        if(query.subCounty) {
            numberPositiveLinkedSql = `${numberPositiveLinkedSql} and SubCounty=?`;
            params.push(query.subCounty);
        }

        if(query.partner) {
            numberPositiveLinkedSql = `${numberPositiveLinkedSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            numberPositiveLinkedSql = `${numberPositiveLinkedSql} and year=?`;
            params.push(query.year);
        }

        if(query.month) {
            numberPositiveLinkedSql = `${numberPositiveLinkedSql} and month=?`;
            params.push(query.month);
        }

        numberPositiveLinkedSql = `${numberPositiveLinkedSql} GROUP BY year,month`;

        return  await this.repository.query(numberPositiveLinkedSql, params);
    }
}
