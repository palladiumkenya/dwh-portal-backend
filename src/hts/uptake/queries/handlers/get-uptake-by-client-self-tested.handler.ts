import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByClientSelfTestedQuery } from '../impl/get-uptake-by-client-self-tested.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByClientSelfTestedQuery)
export class GetUptakeByClientSelfTestedHandler
    implements IQueryHandler<GetUptakeByClientSelfTestedQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByClientSelfTestedQuery): Promise<any> {
        const params = [];
        let uptakeByClientSelfTestedSql = `SELECT
                CASE WHEN ClientSelfTested = '1' THEN 'Yes' WHEN ClientSelfTested = '0' THEN 'No' else ClientSelfTested END ClientSelfTested,
                SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity 
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                LEFT JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                LEFT JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                LEFT JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                LEFT JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                LEFT JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE ClientSelfTested is not null and Tested > 0 and TestType IN ('Initial', 'Initial Test')`;

        if (query.county) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }


        if (query.fromDate) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        uptakeByClientSelfTestedSql = `${uptakeByClientSelfTestedSql} GROUP BY CASE WHEN ClientSelfTested = '1' THEN 'Yes' WHEN ClientSelfTested = '0' THEN 'No' else ClientSelfTested END`;

        return await this.repository.query(uptakeByClientSelfTestedSql, params);
    }
}
