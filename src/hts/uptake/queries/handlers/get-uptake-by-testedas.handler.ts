import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTestedasQuery } from '../impl/get-uptake-by-testedas.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsClientTestedAs } from '../../entities/fact-hts-clienttestedas.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByTestedasQuery)
export class GetUptakeByTestedasHandler
    implements IQueryHandler<GetUptakeByTestedasQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByTestedasQuery): Promise<any> {
        const params = [];
        let uptakeByClientTestedAsSql = `SELECT
                ClientTestedAs AS ClientTestedAs,
                SUM(Tested)Tested, 
                SUM(Positive) Positive, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                INNER JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                INNER JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                INNER JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                INNER JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                INNER JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE ClientTestedAs IS NOT NULL`;

        if (query.county) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.partner);
        }

        // if(query.month) {
        //     uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and year=?`;
        //     params.push(query.year);
        // }

        if (query.fromDate) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} GROUP BY ClientTestedAs`;

        return await this.repository.query(uptakeByClientTestedAsSql, params);
    }
}
