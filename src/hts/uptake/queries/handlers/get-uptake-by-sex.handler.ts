import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeBySexQuery } from '../impl/get-uptake-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../entities/fact-htsuptake-agegender.entity';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeBySexQuery)
export class GetUptakeBySexHandler
    implements IQueryHandler<GetUptakeBySexQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeBySexQuery): Promise<any> {
        const params = [];
        let uptakeBySexSql = `SELECT
                CASE WHEN Gender = 'M' THEN 'Male' WHEN Gender = 'F' THEN 'Female' ELSE Gender END gender,
                SUM(Tested) tested, 
                SUM(Positive) positive, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                INNER JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                INNER JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                INNER JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                INNER JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                INNER JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE Tested > 0 and TestType='Initial Test'`;

        if (query.county) {
            uptakeBySexSql = `${uptakeBySexSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeBySexSql = `${uptakeBySexSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            uptakeBySexSql = `${uptakeBySexSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeBySexSql = `${uptakeBySexSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.partner);
        }

        // if(query.month) {
        //     uptakeBySexSql = `${uptakeBySexSql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     uptakeBySexSql = `${uptakeBySexSql} and year=?`;
        //     params.push(query.year);
        // }

        if (query.fromDate) {
            uptakeBySexSql = `${uptakeBySexSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            uptakeBySexSql = `${uptakeBySexSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        uptakeBySexSql = `${uptakeBySexSql} GROUP BY CASE WHEN Gender = 'M' THEN 'Male' WHEN Gender = 'F' THEN 'Female' ELSE Gender END`;
        return await this.repository.query(uptakeBySexSql, params);
    }
}
