import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetNewOnPrepQuery } from '../impl/get-new-on-prep.query';
import { FactPrep } from '../../entities/fact-prep.model';

@QueryHandler(GetNewOnPrepQuery)
export class GetNewOnPrepHandler implements IQueryHandler<GetNewOnPrepQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetNewOnPrepQuery): Promise<any> {
        const params = [];
        let newOnPrep = `SELECT
                MFLCode Sitecode, 
                FacilityName, 
                County, 
                SubCounty, 
                PartnerName CTPartner, 
                Agencyname CTAgency, 
                visit.month VisitMonth, 
                Visit.year VisitYear,
                Count (distinct (concat(PrepNumber,PatientPKHash,MFLCode))) As StartedPrep
            from NDWH.dbo.FactPrep prep

            LEFT JOIN NDWH.dbo.DimPatient pat ON prep.PatientKey = pat.PatientKey
            LEFT JOIN NDWH.dbo.DimFacility fac ON fac.FacilityKey = prep.FacilityKey
            LEFT JOIN NDWH.dbo.DimPartner p ON p.PartnerKey = prep.PartnerKey
            LEFT JOIN NDWH.dbo.DimAgency a ON a.AgencyKey = prep.AgencyKey
            LEFT JOIN NDWH.dbo.DimAgeGroup age ON age.AgeGroupKey = prep.AgeGroupKey
            LEFT JOIN NDWH.dbo.DimDate visit ON visit.DateKey = prep.VisitDateKey COLLATE Latin1_General_CI_AS
            LEFT JOIN NDWH.dbo.DimDate enrol ON enrol.DateKey = PrepEnrollmentDateKey 

            where enrol.Date is not null
        `; 
        // this.repository
        //     .createQueryBuilder('f')
        //     .select([
        //         'Sitecode, FacilityName, County, SubCounty, CTPartner, CTAgency, VisitMonth, VisitYear, Count (distinct (concat(PrepNumber,PatientPk,SiteCode))) As StartedPrep',
        //     ])
        //     .where('DATEDIFF(month, PrepEnrollmentDate, GETDATE()) = 2');

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

        if (query.year) {
            newOnPrep = `${newOnPrep} and enrol.year = ${query.year}`;
        }

        if (query.month) {
            newOnPrep = `${newOnPrep} and enrol.month = ${query.month}`;
        }

        newOnPrep = `${newOnPrep} GROUP BY MFLCode, FacilityName, County, SubCounty, PartnerName, AgencyName, visit.month, visit.year`;

        return await this.repository.query(newOnPrep, params);
    }
}
