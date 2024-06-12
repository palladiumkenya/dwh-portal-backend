import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByPartnerQuery } from '../impl/get-uptake-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByPartnerQuery)
export class GetUptakeByPartnerHandler
    implements IQueryHandler<GetUptakeByPartnerQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByPartnerQuery): Promise<any> {
        const params = [];
        let uptakeByPartnerSql = `SELECT
                PartnerName AS Partner,
                SUM(Tested) Tested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                ((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                LEFT JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                LEFT JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                LEFT JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                LEFT JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                LEFT JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE EntryPoint IS NOT NULL and TestType IN ('Initial', 'Initial Test')`;

        if (query.county) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.partner);
        }

        if (query.fromDate) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        // if(query.month) {
        //     uptakeByPartnerSql = `${uptakeByPartnerSql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     uptakeByPartnerSql = `${uptakeByPartnerSql} and year=?`;
        //     params.push(query.year);
        // }

        uptakeByPartnerSql = `${uptakeByPartnerSql} GROUP BY PartnerName ORDER BY SUM(Tested) DESC`;

        return await this.repository.query(uptakeByPartnerSql, params);
    }
}
