import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTbScreenedQuery } from '../impl/get-uptake-by-tb-screened.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsTBScreening } from '../../entities/fact-hts-tbscreening.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByTbScreenedQuery)
export class GetUptakeByTbScreenedHandler
    implements IQueryHandler<GetUptakeByTbScreenedQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetUptakeByTbScreenedQuery): Promise<any> {
        const params = [];
        let uptakeByTBScreenedSql = `SELECT
                CASE WHEN TBScreening IN ('No Signs','On TB Treatment','Presumed TB','TB Confirmed','TB Prophylaxis', 'No TB signs', 'PrTB') THEN 'Screened for TB' WHEN TBScreening in ('', 'Not done') THEN 'Not Screened for TB' END AS TBSCreening_grp,
                SUM(Tested)Tested, 
                SUM(Positive) Positive, 
                SUM(Linked) Linked
            FROM
                NDWH.dbo.FactHTSClientTests AS link
                LEFT JOIN NDWH.dbo.DimPatient AS pat ON link.PatientKey = pat.PatientKey
                LEFT JOIN NDWH.dbo.DimAgeGroup AS age ON link.AgeGroupKey = age.AgeGroupKey
                LEFT JOIN NDWH.dbo.DimPartner AS part ON link.PartnerKey = part.PartnerKey
                LEFT JOIN NDWH.dbo.DimFacility AS fac ON link.FacilityKey = fac.FacilityKey
                LEFT JOIN NDWH.dbo.DimAgency AS agency ON link.AgencyKey = agency.AgencyKey
            WHERE TBScreening IS NOT NULL and TestType IN ('Initial', 'Initial Test')`;

        if (query.county) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and subcounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.partner);
        }

        // if(query.month) {
        //     uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and year=?`;
        //     params.push(query.year);
        // }

        if (query.fromDate) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and DateTestedKey >= ${query.fromDate}01`;
        }

        if (query.toDate) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and DateTestedKey <= EOMONTH('${query.toDate}01')`;
        }

        uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} GROUP BY CASE WHEN TBScreening IN ('No Signs','On TB Treatment','Presumed TB','TB Confirmed','TB Prophylaxis', 'No TB signs', 'PrTB') THEN 'Screened for TB' WHEN TBScreening in ('', 'Not done') THEN 'Not Screened for TB' END`;

        return await this.repository.query(uptakeByTBScreenedSql, params);
    }
}
