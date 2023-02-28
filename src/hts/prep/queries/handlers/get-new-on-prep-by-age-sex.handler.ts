import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetNewOnPrepByAgeSexQuery } from '../impl/get-new-on-prep-by-age-sex.query';
import { FactPrep } from '../../entities/fact-prep.model';

@QueryHandler(GetNewOnPrepByAgeSexQuery)
export class GetNewOnPrepByAgeSexHandler
    implements IQueryHandler<GetNewOnPrepByAgeSexQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetNewOnPrepByAgeSexQuery): Promise<any> {
        const params = [];
        let newOnPrep = `SELECT
                DatimAgeGroup,
                Gender,
                Count (distinct (concat(PrepNumber,PatientPKHash,MFLCode))) As StartedPrep
            from NDWH.dbo.FactPrep prep

            LEFT JOIN NDWH.dbo.DimPatient pat ON prep.PatientKey = pat.PatientKey
            LEFT JOIN NDWH.dbo.DimFacility fac ON fac.FacilityKey = prep.FacilityKey
            LEFT JOIN NDWH.dbo.DimPartner p ON p.PartnerKey = prep.PartnerKey
            LEFT JOIN NDWH.dbo.DimAgency a ON a.AgencyKey = prep.AgencyKey
            LEFT JOIN NDWH.dbo.DimAgeGroup age ON age.AgeGroupKey = prep.AgeGroupKey
            LEFT JOIN NDWH.dbo.DimDate visit ON visit.DateKey = prep.VisitDateKey COLLATE Latin1_General_CI_AS
            LEFT JOIN NDWH.dbo.DimDate enrol ON enrol.DateKey = PrepEnrollmentDateKey 

            where DATEDIFF(month, enrol.Date, GETDATE()) = 1
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

        newOnPrep = `${newOnPrep} GROUP BY DATIMAgeGroup, Gender
						ORDER BY DATIMAgeGroup, Gender`;

        return await this.repository.query(newOnPrep, params);
    }
}
