import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDWHHTSTestTrendsQuery } from '../impl/get-dwh-htstest-trends.query';
import { FactHTSClientTests } from '../../../../hts/linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetDWHHTSTestTrendsQuery)
export class GetDWHHTSTestTrendsHandler
    implements IQueryHandler<GetDWHHTSTestTrendsQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetDWHHTSTestTrendsQuery): Promise<any> {
        const params = [];
        let htsTested = `SELECT 
            year(DateTestedKey) year, month(DateTestedKey) month, SUM( Tested ) tested
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                INNER JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                INNER JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                INNER JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                INNER JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                INNER JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE Tested IS NOT NULL `;

        if (query.county) {
            htsTested = `${htsTested} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            htsTested = `${htsTested} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            htsTested = `${htsTested} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            htsTested = `${htsTested} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.month) {
            htsTested = `${htsTested} and month(DateTestedKey) = ${query.month}`;
        }

        if (query.year) {
            htsTested = `${htsTested} and year(DateTestedKey) = ${query.year}`;
        }

        if (query.datimAgeGroup) {
            htsTested = `${htsTested} and MOHAgeGroup IN('${query.datimAgeGroup
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.datimAgeGroup);
        }


        // if (query.fromDate) {
        //     htsTested = `${htsTested} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
        //     params.push(query.fromDate);
        // }

        // if (query.toDate) {
        //     htsTested = `${htsTested} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
        //     params.push(query.toDate);
        // }

        htsTested = `${htsTested} GROUP BY year(DateTestedKey), month(DateTestedKey) ORDER BY year(DateTestedKey), month(DateTestedKey)`;
        return await this.repository.query(htsTested, params);
    }
}
