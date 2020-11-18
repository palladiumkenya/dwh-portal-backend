import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { RecencyByCountyDto } from '../../entities/dtos/recency-by-county.dto';
import { GetRecencyByCountyQuery } from '../impl/get-recency-by-county.query';

@QueryHandler(GetRecencyByCountyQuery)
export class GetRecencyByCountyHandler implements IQueryHandler<GetRecencyByCountyQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>
    ) {

    }

    async execute(query: GetRecencyByCountyQuery): Promise<RecencyByCountyDto> {
        const params = [];
        params.push(query.docket);
        let recencyOfReportingByCountySql = `SELECT a.county
            \t,recency
            \t,b.expected
            \t,ROUND(recency * 100 / b.expected) AS Percentage
            FROM (
            \tSELECT SUM(recency) AS recency
            \t\t,county
            \tFROM recency_uploads
            \tWHERE docket = ?`;

        if(query.county) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and county IN (?)`;
            params.push(query.county);
        }

        // if(query.subCounty) {
        //     recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and subCounty IN (?)`;
        //     params.push(query.subCounty);
        // }

        // if(query.facility) {
        //     recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and facility IN (?)`;
        //     params.push(query.facility);
        // }

        if(query.partner) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and partner IN (?)`;
            params.push(query.partner);
        }

        if (query.agency) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and agency IN (?)`;
            params.push(query.agency);
        }

        if(query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} AND month = ? AND year = ?\n`;
            params.push(month);
            params.push(year);
        }

        if (query.docket) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} GROUP BY county
                                    \t) a
                                    INNER JOIN (
                                    \tSELECT SUM(expected) AS expected
                                    \t\t,county
                                    \tFROM expected_uploads
                                    \tWHERE docket = ?`;
            params.push(query.docket);
        }

        if(query.county) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and county IN (?)`;
            params.push(query.county);
        }

        // if(query.subCounty) {
        //     recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and subCounty IN (?)`;
        //     params.push(query.subCounty);
        // }

        // if(query.facility) {
        //     recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and facility IN (?)`;
        //     params.push(query.facility);
        // }

        if(query.partner) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and partner IN (?)`;
            params.push(query.partner);
        }

        if (query.agency) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and agency IN (?)`;
            params.push(query.agency);
        }

        recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} GROUP BY county
                                    \t) b ON b.county = a.county`;


        recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} ORDER BY ROUND(recency * 100 / b.expected) DESC`;

        return await this.repository.query(recencyOfReportingByCountySql, params);
    }
}
