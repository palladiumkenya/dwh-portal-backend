import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPrep } from '../../entities/fact-prep.model';
import { GetPrepTotalTestedQuery } from '../impl/get-prep-total-tested.query';

@QueryHandler(GetPrepTotalTestedQuery)
export class GetPrepTotalTestedHandler implements IQueryHandler<GetPrepTotalTestedQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetPrepTotalTestedQuery): Promise<any> {
        const params = [];
        let newOnPrep = `SELECT
            SUM(s.tested) + SUM(p.tested) TotalTested
        from AggregatePrepTestingAt1MonthRefill s
        FULL OUTER JOIN AggregatePrepTestingAt3MonthRefill p on p.MFLCode = s.MFLCode and s.FacilityName = p.FacilityName and s.County = p.County and s.SubCounty = p.SubCounty and s.PartnerName = p.PartnerName and s.AgencyName = p.AgencyName and s.Gender = p.Gender and s.AgeGroup = s.AgeGroup and s.Month = p.Month and s.Year = p.Year
        WHERE s.MFLCode is not null
        `;

        if (query.county) {
            newOnPrep = `${newOnPrep} and (s.County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}') or p.County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}'))`;
        }

        if (query.subCounty) {
            newOnPrep = `${newOnPrep} and (s.SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}') or p.SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}'))`;
        }

        if (query.facility) {
            newOnPrep = `${newOnPrep} and (s.FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}') or p.FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}'))`;
        }

        if (query.partner) {
            newOnPrep = `${newOnPrep} and (s.PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}') or p.PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}'))`;
        }

        if (query.agency) {
            newOnPrep = `${newOnPrep} and (s.AgencyName IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}') or p.AgencyName IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}'))`;
        }

        if (query.gender) {
            newOnPrep = `${newOnPrep} and (s.Gender IN ('${query.gender
                .toString()
                .replace(/,/g, "','")}') or p.Gender IN ('${query.gender
                .toString()
                .replace(/,/g, "','")}'))`;
        }

        if (query.datimAgeGroup) {
            newOnPrep = `${newOnPrep} and (s.AgeGroup IN ('${query.datimAgeGroup
                .toString()
                .replace(/,/g, "','")}') or p.AgeGroup IN ('${query.datimAgeGroup
                .toString()
                .replace(/,/g, "','")}'))`;
        }

        if (query.year) {
            newOnPrep = `${newOnPrep} and (s.year = ${query.year} or p.year = ${query.year})`;
        }

        if (query.month) {
            newOnPrep = `${newOnPrep} and (s.month = ${query.month} or p.month = ${query.month})`;
        }

        return await this.repository.query(newOnPrep, params);
    }
}
