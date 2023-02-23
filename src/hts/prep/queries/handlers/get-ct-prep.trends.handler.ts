import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPrep } from '../../entities/fact-prep.model';
import { GetCTPrepTrendQuery } from '../impl/get-ct-prep-trends.query';
import { GetCTPrepQuery } from '../impl/get-ct-prep.query';

@QueryHandler(GetCTPrepTrendQuery)
export class GetCTPrepTrendHandler implements IQueryHandler<GetCTPrepTrendQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetCTPrepTrendQuery): Promise<any> {
        const params = [];
        let newOnPrep = `Select 
        visit.year,
        visit.month,
        Count (distinct (concat(PrepNumber,PatientPkHash,SiteCode))) As PrepCT
    from NDWH.dbo.FACTPrep prep
        LEFT JOIN NDWH.dbo.DimPatient pat ON prep.PatientKey = pat.PatientKey
        LEFT JOIN NDWH.dbo.DimFacility fac ON fac.FacilityKey = prep.FacilityKey
        LEFT JOIN NDWH.dbo.DimPartner p ON p.PartnerKey = prep.PartnerKey
        LEFT JOIN NDWH.dbo.DimAgency a ON a.AgencyKey = prep.AgencyKey
        LEFT JOIN NDWH.dbo.DimAgeGroup age ON age.AgeGroupKey = prep.AgeGroupKey
        LEFT JOIN NDWH.dbo.DimDate visit ON visit.DateKey = prep.VisitDateKey COLLATE Latin1_General_CI_AS
    where VisitDateKey is not null and VisitDateKey <> PrepEnrollmentDateKey 

        `;

        if (query.county) {
            newOnPrep = `${newOnPrep} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            newOnPrep = `${newOnPrep} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            newOnPrep = `${newOnPrep} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            newOnPrep = `${newOnPrep} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.agency) {
            newOnPrep = `${newOnPrep} and AgencyName IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.gender) {
            newOnPrep = `${newOnPrep} and Gender IN ('${query.gender
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.datimAgeGroup) {
            newOnPrep = `${newOnPrep} and DATIMAgeGroup IN ('${query.datimAgeGroup
                .toString()
                .replace(/,/g, "','")}')`;
        }

        newOnPrep = `${newOnPrep} 
        Group BY visit.year, visit.month
        Order by visit.year DESC, visit.month DESC`

    return await this.repository.query(newOnPrep, params);
    }
}
