import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTestingStrategyQuery } from '../impl/get-uptake-by-testing-strategy.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsTeststrategy } from '../../entities/fact-hts-teststrategy.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByTestingStrategyQuery)
export class GetUptakeByTestingStrategyHandler
    implements IQueryHandler<GetUptakeByTestingStrategyQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByTestingStrategyQuery): Promise<any> {
        const params = [];
        let uptakeByPopulationTypeSql = `SELECT
                TestStrategy AS TestStrategy,
                SUM(Tested)Tested, 
                SUM(Positive) Positive, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                INNER JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                INNER JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                INNER JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                INNER JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                INNER JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE TestStrategy IS NOT NULL`;

        if (query.county) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and PartnerName IN (?)`;
            params.push(query.partner);
        }

        // if(query.month) {
        //     uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and year=?`;
        //     params.push(query.year);
        // }

        if (query.fromDate) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and DateTestedKey <= ${query.toDate}01`;
        }

        uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} GROUP BY TestStrategy ORDER BY SUM(Tested) DESC`;

        return await this.repository.query(uptakeByPopulationTypeSql, params);
    }
}
