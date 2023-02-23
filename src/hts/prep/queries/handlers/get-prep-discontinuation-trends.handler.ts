import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPrep } from '../../entities/fact-prep.model';
import { GetPrepDiscontinuationTrendsQuery } from '../impl/get-prep-discontinuation-trends.query';
import { GetPrepDiscontinuationQuery } from '../impl/get-prep-discontinuation.query';

@QueryHandler(GetPrepDiscontinuationTrendsQuery)
export class GetPrepDiscontinuationTrendHandler
    implements IQueryHandler<GetPrepDiscontinuationTrendsQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetPrepDiscontinuationTrendsQuery): Promise<any> {
        let params = []
        let prepDiscontinuation = `SELECT
        ex.month,
        ex.year,
        COUNT ( DISTINCT ( concat ( PrepNumber, PatientPKHash, MFLCode ) )  )AS PrepDiscontinuations
    from NDWH.dbo.FactPrep prep

    LEFT JOIN NDWH.dbo.DimPatient pat ON prep.PatientKey = pat.PatientKey
    LEFT JOIN NDWH.dbo.DimFacility fac ON fac.FacilityKey = prep.FacilityKey
    LEFT JOIN NDWH.dbo.DimPartner p ON p.PartnerKey = prep.PartnerKey
    LEFT JOIN NDWH.dbo.DimAgency a ON a.AgencyKey = prep.AgencyKey
    LEFT JOIN NDWH.dbo.DimAgeGroup age ON age.AgeGroupKey = prep.AgeGroupKey
    LEFT JOIN NDWH.dbo.DimDate ex ON ex.DateKey = ExitDateKey COLLATE Latin1_General_CI_AS

    where ExitDateKey is not null 

`;

        if (query.county) {
            prepDiscontinuation = `${prepDiscontinuation} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            prepDiscontinuation = `${prepDiscontinuation} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            prepDiscontinuation = `${prepDiscontinuation} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            prepDiscontinuation = `${prepDiscontinuation} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.agency) {
            prepDiscontinuation = `${prepDiscontinuation} and AgencyName IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.gender) {
            prepDiscontinuation = `${prepDiscontinuation} and Gender IN ('${query.gender
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.datimAgeGroup) {
            prepDiscontinuation = `${prepDiscontinuation} and DATIMAgeGroup IN ('${query.datimAgeGroup
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.year) {
            prepDiscontinuation = `${prepDiscontinuation} and ex.year = ${query.year}`;
        }

        if (query.month) {
            prepDiscontinuation = `${prepDiscontinuation} and ex.month = ${query.month}`;
        }

        prepDiscontinuation = `${prepDiscontinuation} 
            Group BY ex.year, ex.month
            Order by ex.year DESC, ex.month DESC`

        return await this.repository.query(prepDiscontinuation, params);
    }
}
