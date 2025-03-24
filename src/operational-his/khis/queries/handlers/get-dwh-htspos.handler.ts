import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDWHHTSPOSPositiveQuery } from '../impl/get-dwh-htspos-positive.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../../hts/uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetDWHHTSPOSPositiveQuery)
export class GetDWHHTSPOSPositiveHandler
    implements IQueryHandler<GetDWHHTSPOSPositiveQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetDWHHTSPOSPositiveQuery): Promise<any> {
        const params = [];
        let uptakeBySexSql = `SELECT SUM(Tested) tested, 
            SUM(Positive) positive, 
            SUM( CASE WHEN DATIMAgeGroup IN ( 'Under 5', '5 to 9', '10 to 14' ) THEN Positive ELSE 0 END ) AS children, 
            SUM( CASE WHEN DATIMAgeGroup IN ( 'Under 5', '5 to 9', '10 to 14' ) THEN Tested ELSE 0 END ) AS childrenTested, 
            SUM( CASE WHEN DATIMAgeGroup IN ( '10 to 14', '15 to 19' ) THEN Positive ELSE 0 END ) AS adolescent, 
            SUM( CASE WHEN DATIMAgeGroup IN ( '10 to 14', '15 to 19' ) THEN Tested ELSE 0 END ) AS adolescentTested, 
            SUM( CASE WHEN DATIMAgeGroup IN ( '15 to 19', '20 to 24', '25 to 29', '30 to 34', '35 to 39', '40 to 44', '45 to 49', '50 to 54', '55 to 59', '60 to 64', '65+' ) THEN Positive ELSE 0  END ) AS adult,
            SUM( CASE WHEN DATIMAgeGroup IN ( '15 to 19', '20 to 24', '25 to 29', '30 to 34', '35 to 39', '40 to 44', '45 to 49', '50 to 54', '55 to 59', '60 to 64', '65+' ) THEN Tested ELSE 0  END ) AS adultTested,
            ((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity 
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

        uptakeBySexSql = `${uptakeBySexSql}`;
        return await this.repository.query(uptakeBySexSql, params);
    }
}
