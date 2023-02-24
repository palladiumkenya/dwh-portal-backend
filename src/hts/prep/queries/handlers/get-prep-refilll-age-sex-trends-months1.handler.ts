import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPrep } from '../../entities/fact-prep.model';
import { GetCTPrepQuery } from '../impl/get-ct-prep.query';
import { GetPrepRefillAgeSexMonth1Query } from '../impl/get-prep-refill-age-sex-Month1.query';
import { GetPrepTotalTestedAgeSexTrendsMonth1Query } from '../impl/get-prep-total-tested-age-sex-trends-month1.query';
import { GetPrepTotalTestedTrendsQuery } from '../impl/get-prep-total-tested-trends.query';
import { GetPrepTotalTestedQuery } from '../impl/get-prep-total-tested.query';

@QueryHandler(GetPrepRefillAgeSexMonth1Query)
export class GetPrepRefillAgeSexTrendsmonth1Handler implements IQueryHandler<GetPrepRefillAgeSexMonth1Query> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetPrepRefillAgeSexMonth1Query): Promise<any> {
        const params = [];
        let newOnPrep = `SELECT
         DATIMAgeGroup,
         sum(case when RefilMonth1 is not null then 1 else 0 end) tested
         from NDWH.dbo.FactPrep prep
         LEFT JOIN NDWH.dbo.DimPatient pat ON prep.PatientKey = pat.PatientKey
         LEFT JOIN NDWH.dbo.DimFacility fac ON fac.FacilityKey = prep.FacilityKey
         LEFT JOIN NDWH.dbo.DimPartner p ON p.PartnerKey = prep.PartnerKey
         LEFT JOIN NDWH.dbo.DimAgency a ON a.AgencyKey = prep.AgencyKey
         LEFT JOIN NDWH.dbo.DimAgeGroup age ON age.AgeGroupKey = prep.AgeGroupKey
         LEFT JOIN NDWH.dbo.DimDate visit ON visit.DateKey = prep.VisitDateKey COLLATE Latin1_General_CI_AS
         LEFT JOIN NDWH.dbo.DimDate test ON test.DateKey = DateTestMonth1Key COLLATE Latin1_General_CI_AS
         WHERE DATEDIFF(month, visit.Date, GETDATE()) = 1 and RefilMonth1 is not null
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
         GROUP BY DATIMAgeGroup
         Order by DATIMAgeGroup
`

    

        return await this.repository.query(newOnPrep, params);
    }
}
