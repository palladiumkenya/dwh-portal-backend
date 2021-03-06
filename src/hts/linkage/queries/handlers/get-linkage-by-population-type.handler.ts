import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByPopulationTypeQuery } from '../impl/get-linkage-by-population-type.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsPopulationType } from '../../entities/fact-hts-populationtype.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetLinkageByPopulationTypeQuery)
export class GetLinkageByPopulationTypeHandler implements IQueryHandler<GetLinkageByPopulationTypeQuery> {
    constructor(
        @InjectRepository(FactHtsPopulationType)
        private readonly repository: Repository<FactHtsPopulationType>
    ){}

    async execute(query: GetLinkageByPopulationTypeQuery): Promise<any> {
        const params = [];
        let linkageByPopulationTypeSql = 'SELECT ' +
            'PopulationType AS PopulationType, ' +
            'SUM(CASE WHEN Positive IS NULL THEN 0 ELSE Positive END) positive, ' +
            'SUM(CASE WHEN Linked IS NULL THEN 0 ELSE Linked END) linked, ' +
            '((SUM(CASE WHEN Linked IS NULL THEN 0 ELSE Linked END)/SUM(positive))*100) AS linkage ' +
            'FROM fact_hts_populationtype ' +
            'WHERE PopulationType IS NOT NULL AND positive > 0 ';

        if(query.county) {
            linkageByPopulationTypeSql = `${linkageByPopulationTypeSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            linkageByPopulationTypeSql = `${linkageByPopulationTypeSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }
        
        if(query.facility) {
            linkageByPopulationTypeSql = `${linkageByPopulationTypeSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            linkageByPopulationTypeSql = `${linkageByPopulationTypeSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.year) {
            linkageByPopulationTypeSql = `${linkageByPopulationTypeSql} and year=?`;
            params.push(query.year);
        }

        if(query.month) {
            linkageByPopulationTypeSql = `${linkageByPopulationTypeSql} and month=?`;
            params.push(query.month);
        }

        linkageByPopulationTypeSql = `${linkageByPopulationTypeSql} GROUP BY PopulationType`;

        return  await this.repository.query(linkageByPopulationTypeSql, params);
    }

}
