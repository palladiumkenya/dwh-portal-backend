import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByEntryPointQuery } from '../impl/get-uptake-by-entrypoint.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsEntryPoint } from '../../entities/fact-hts-entrypoint.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByEntryPointQuery)
export class GetUptakeByEntrypointHandler
    implements IQueryHandler<GetUptakeByEntryPointQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByEntryPointQuery): Promise<any> {
        const params = [];
        let uptakeByEntryPointSql = `SELECT
                EntryPoint AS EntryPoint,
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
            WHERE EntryPoint IS NOT NULL and TestType IN ('Initial', 'Initial Test')`;

        if (query.county) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.partner);
        }

        // if(query.month) {
        //     uptakeByEntryPointSql = `${uptakeByEntryPointSql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     uptakeByEntryPointSql = `${uptakeByEntryPointSql} and year=?`;
        //     params.push(query.year);
        // }

        if (query.fromDate) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        uptakeByEntryPointSql = `${uptakeByEntryPointSql} GROUP BY EntryPoint ORDER BY SUM(Tested) DESC`;

        return await this.repository.query(uptakeByEntryPointSql, params);
    }
}
