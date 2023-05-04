import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByMonthsSinceLastTestQuery } from '../impl/get-uptake-by-months-since-last-test.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsMonthsLastTest } from '../../entities/fact-hts-monthslasttest.entity';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByMonthsSinceLastTestQuery)
export class GetUptakeByMonthsSinceLastTestHandler
    implements IQueryHandler<GetUptakeByMonthsSinceLastTestQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByMonthsSinceLastTestQuery): Promise<any> {
        const params = [];
        let uptakeByPopulationTypeSql = `SELECT
                MonthsLastTest MonthLastTest,
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
            WHERE Tested > 0 AND MonthsLastTest IS NOT NULL and TestType IN ('Initial', 'Initial Test')`;

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
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
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
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} GROUP BY MonthsLastTest`;

        const resultSet = await this.repository.query(
            uptakeByPopulationTypeSql,
            params,
        );

        const returnedVal = [];
        const groupings = [
            '<3 Months',
            '3-6 Months',
            '6-9 Months',
            '9-12 Months',
            '12-18 Months',
            '18-24 Months',
            '24-36 Months',
            '36-48 Months',
            '>48Months',
        ];
        for (let i = 0; i < groupings.length; i++) {
            for (let j = 0; j < resultSet.length; j++) {
                if (resultSet[j].MonthLastTest == groupings[i]) {
                    returnedVal.push(resultSet[j]);
                }
            }
        }

        return returnedVal;
    }
}
