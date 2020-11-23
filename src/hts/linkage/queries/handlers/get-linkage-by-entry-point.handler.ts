import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageByEntryPointQuery } from '../impl/get-linkage-by-entry-point.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsEntryPoint } from '../../entities/fact-hts-entrypoint.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetLinkageByEntryPointQuery)
export class GetLinkageByEntryPointHandler implements IQueryHandler<GetLinkageByEntryPointQuery> {
    constructor(
        @InjectRepository(FactHtsEntryPoint)
        private readonly repository: Repository<FactHtsEntryPoint>
    ){}

    async execute(query: GetLinkageByEntryPointQuery): Promise<any> {
        const params = [];
        let linkageByEntryPointSql = 'SELECT \n' +
            '`EntryPoint` AS entryPoint, \n' +
            'SUM(CASE WHEN `Tested` IS NULL THEN 0 ELSE `Tested` END) tested, \n' +
            'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
            '((SUM(CASE WHEN `linked` IS NULL THEN 0 ELSE `linked` END)/SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END))*100) AS linkage \n' +
            'FROM `fact_hts_entrypoint` \n' +
            'WHERE EntryPoint IS NOT NULL AND EntryPoint <> "NULL" AND positive IS NOT NULL AND positive > 0';

        if(query.county) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.year) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and year=?`;
            params.push(query.year);
        }

        if(query.month) {
            linkageByEntryPointSql = `${linkageByEntryPointSql} and month=?`;
            params.push(query.month);
        }

        linkageByEntryPointSql = `${linkageByEntryPointSql} GROUP BY EntryPoint ORDER BY SUM(\`positive\`) DESC`;

        return  await this.repository.query(linkageByEntryPointSql, params);
    }
}
