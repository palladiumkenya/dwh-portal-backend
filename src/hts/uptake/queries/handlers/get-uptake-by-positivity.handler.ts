import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByPositivityQuery } from '../impl/get-uptake-by-positivity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByPositivityQuery)
export class GetUptakeByPositivityHandler
    implements IQueryHandler<GetUptakeByPositivityQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByPositivityQuery): Promise<any> {
        const params = [];
        let numberTestedPositivitySql = `SELECT
                YEAR(DateTestedKey) YEAR,
                MONTH(DateTestedKey) MONTH, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                INNER JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                INNER JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                INNER JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                INNER JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                INNER JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE Tested > 0`;

        if (query.county) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and PartnerName IN (?)`;
            params.push(query.partner);
        }

        // if(query.month) {
        //     numberTestedPositivitySql = `${numberTestedPositivitySql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     const dateVal = new Date();
        //     const yearVal = dateVal.getFullYear();

        //     if(query.year == yearVal) {
        //         numberTestedPositivitySql = `${numberTestedPositivitySql} and  (YEAR >= YEAR(DATE_SUB(NOW(), INTERVAL 11 MONTH)))`;
        //     } else {
        //         numberTestedPositivitySql = `${numberTestedPositivitySql} and year=?`;
        //     }

        //     params.push(query.year);
        // }
        if (query.fromDate) {
            const dateVal = new Date();
            const yearVal = dateVal.getFullYear();
            numberTestedPositivitySql = `${numberTestedPositivitySql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            numberTestedPositivitySql = `${numberTestedPositivitySql} and DateTestedKey <= ${query.toDate}01`;
        }

        numberTestedPositivitySql = `${numberTestedPositivitySql} GROUP BY YEAR(DateTestedKey), month(DateTestedKey)`;

        return await this.repository.query(numberTestedPositivitySql, params);
    }
}
