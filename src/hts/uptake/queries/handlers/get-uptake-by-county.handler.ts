import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByCountyQuery } from '../impl/get-uptake-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByCountyQuery)
export class GetUptakeByCountyHandler
    implements IQueryHandler<GetUptakeByCountyQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByCountyQuery): Promise<any> {
        const params = [];
        let uptakeByCountySql = null;

        if (query.county) {
            uptakeByCountySql = `SELECT
                    SubCounty AS County,
                    SUM(Tested) Tested,
                    SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                    ((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity
                FROM
                    NDWH.dbo.FactHTSClientTests AS link
                    INNER JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                    INNER JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                    INNER JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                    INNER JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                    INNER JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
                WHERE SubCounty IS NOT NULL and TestType='Initial Test'`;
        } else {
            uptakeByCountySql = `SELECT
                    County AS County,
                    SUM(Tested) Tested,
                    SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive,
                    ((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity
                FROM
                    NDWH.dbo.FactHTSClientTests AS link
                    INNER JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                    INNER JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                    INNER JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                    INNER JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                    INNER JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
                WHERE County IS NOT NULL and TestType='Initial Test'`;
        }

        if (query.county) {
            uptakeByCountySql = `${uptakeByCountySql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByCountySql = `${uptakeByCountySql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            uptakeByCountySql = `${uptakeByCountySql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByCountySql = `${uptakeByCountySql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.partner);
        }

        // if(query.month) {
        //     uptakeByCountySql = `${uptakeByCountySql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     uptakeByCountySql = `${uptakeByCountySql} and year=?`;
        //     params.push(query.year);
        // }

        if (query.fromDate) {
            uptakeByCountySql = `${uptakeByCountySql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            uptakeByCountySql = `${uptakeByCountySql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        if (query.county) {
            uptakeByCountySql = `${uptakeByCountySql} GROUP BY SubCounty ORDER BY SUM(Tested) DESC`;
        } else {
            uptakeByCountySql = `${uptakeByCountySql} GROUP BY County ORDER BY SUM(Tested) DESC`;
        }

        return await this.repository.query(uptakeByCountySql, params);
    }
}
