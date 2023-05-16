import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTbScreeningQuery } from '../impl/get-uptake-by-tb-screening.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsTBScreening } from '../../entities/fact-hts-tbscreening.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByTbScreeningQuery)
export class GetUptakeByTBScreeningHandler
    implements IQueryHandler<GetUptakeByTbScreeningQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByTbScreeningQuery): Promise<any> {
        const params = [];
        let uptakeByClientTestedAsSql = `SELECT
                TBScreening tbScreeningOutcomes,
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
            WHERE TBScreening IS NOT NULL and TestType IN ('Initial', 'Initial Test')`;

        if (query.county) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and subcounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.partner);
        }

        if (query.facility) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
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

        uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} GROUP BY TBScreening`;

        return await this.repository.query(uptakeByClientTestedAsSql, params);
    }
}
