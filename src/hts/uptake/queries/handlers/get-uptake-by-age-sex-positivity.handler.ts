import { GetUptakeByAgeSexPositivityQuery } from '../impl/get-uptake-by-age-sex-positivity.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptakeAgeGender } from '../../entities/fact-htsuptake-agegender.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByAgeSexPositivityQuery)
export class GetUptakeByAgeSexPositivityHandler
    implements IQueryHandler<GetUptakeByAgeSexPositivityQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByAgeSexPositivityQuery): Promise<any> {
        const params = [];
        let uptakeByAgeSexSql = `SELECT
                DATIMAgeGroup AgeGroup,
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
                .replace(/,/g, "','")}')`
        }

        if (query.month) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and month(DateTestedKey) = ${query.month}`;
        }

        if (query.year) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and year(DateTestedKey) = ${query.year}`;
        }

        if (query.fromDate) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        uptakeByAgeSexSql = `${uptakeByAgeSexSql} GROUP BY DATIMAgeGroup`;
        return await this.repository.query(uptakeByAgeSexSql, params);
    }
}
