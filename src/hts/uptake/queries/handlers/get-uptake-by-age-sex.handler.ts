import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByAgeSexQuery } from '../impl/get-uptake-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByAgeSexQuery)
export class GetUptakeByAgeSexHandler
    implements IQueryHandler<GetUptakeByAgeSexQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByAgeSexQuery): Promise<any> {
        const params = [];
        let uptakeByAgeSexSql = `SELECT
                DATIMAgeGroup AgeGroup,
                CASE WHEN Gender = 'M' THEN 'Male' WHEN Gender = 'F' THEN 'Female' ELSE Gender END Gender,
                SUM(Tested) Tested
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                LEFT JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                LEFT JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                LEFT JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                LEFT JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                LEFT JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE Tested is not null and TestType IN ('Initial', 'Initial Test')`;

        if (query.county) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }



        if (query.fromDate) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        uptakeByAgeSexSql = `${uptakeByAgeSexSql} GROUP BY DATIMAgeGroup, CASE WHEN Gender = 'M' THEN 'Male' WHEN Gender = 'F' THEN 'Female' ELSE Gender END`;
        return await this.repository.query(uptakeByAgeSexSql, params);
    }
}
