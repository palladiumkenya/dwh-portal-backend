import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDWHHTSPOSByAgeQuery } from '../impl/get-dwh-htspos-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../../hts/uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetDWHHTSPOSByAgeQuery)
export class GetDWHHTSPOSByAgeHandler
    implements IQueryHandler<GetDWHHTSPOSByAgeQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetDWHHTSPOSByAgeQuery): Promise<any> {
        const params = [];
        let uptakeBySexSql = `SELECT 
            DATIMAgeGroup AgeGroup, SUM(Positive) positive, SUM(Tested) tested
            FROM
                NDWH.Fact.FactHTSClientTests AS link
                INNER JOIN NDWH.Dim.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                INNER JOIN NDWH.Dim.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                INNER JOIN NDWH.Dim.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                INNER JOIN NDWH.Dim.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                INNER JOIN NDWH.Dim.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE Tested > 0 `;

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

        uptakeBySexSql = `${uptakeBySexSql} GROUP BY DATIMAgeGroup`;
        return await this.repository.query(uptakeBySexSql, params);
    }
}
