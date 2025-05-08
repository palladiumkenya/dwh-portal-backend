import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDWHHTSPOSByFacilityQuery } from '../impl/get-dwh-htspos-by-facility.query';
import { AggregateHTSUptake } from '../../../../hts/uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetDWHHTSPOSByFacilityQuery)
export class GetDWHHTSPOSByFacilityHandler
    implements IQueryHandler<GetDWHHTSPOSByFacilityQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetDWHHTSPOSByFacilityQuery): Promise<any> {
        const params = [];
        let uptakeBySexSql = `SELECT
            FacilityName, County, SubCounty, Mflcode, PartnerName CTPartner, SUM(Tested) tested, sum(Positive) positive
            FROM
                NDWH.Fact.FactHTSClientTests AS link
                INNER JOIN NDWH.Dim.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                INNER JOIN NDWH.Dim.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                INNER JOIN NDWH.Dim.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                INNER JOIN NDWH.Dim.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                INNER JOIN NDWH.Dim.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE Tested IS NOT NULL `;

        if (query.county) {
            uptakeBySexSql = `${uptakeBySexSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            uptakeBySexSql = `${uptakeBySexSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            uptakeBySexSql = `${uptakeBySexSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            uptakeBySexSql = `${uptakeBySexSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.month) {
            uptakeBySexSql = `${uptakeBySexSql} and month(DateTestedKey) = ${query.month}`;
        }

        if (query.year) {
            uptakeBySexSql = `${uptakeBySexSql} and year(DateTestedKey) = ${query.year}`;
        }

        if (query.datimAgeGroup) {
            uptakeBySexSql = `${uptakeBySexSql} and MOHAgeGroup IN('${query.datimAgeGroup
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.datimAgeGroup);
        }

        // if (query.fromDate) {
        //     uptakeBySexSql = `${uptakeBySexSql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
        //     params.push(query.fromDate);
        // }

        // if (query.toDate) {
        //     uptakeBySexSql = `${uptakeBySexSql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
        //     params.push(query.toDate);
        // }

        uptakeBySexSql = `${uptakeBySexSql} GROUP BY FacilityName, County, SubCounty, Mflcode, PartnerName`;
        return await this.repository.query(uptakeBySexSql, params);
    }
}
