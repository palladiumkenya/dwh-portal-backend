import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPrep } from '../../entities/fact-prep.model';
import { GetPrepTotalTestedAgeSexTrendsMonth3Query } from '../impl/get-prep-total-tested-age-sex-trends-month3.query';

@QueryHandler(GetPrepTotalTestedAgeSexTrendsMonth3Query)
export class GetPrepTotalTestedAgeSexTrendsmonth3Handler implements IQueryHandler<GetPrepTotalTestedAgeSexTrendsMonth3Query> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetPrepTotalTestedAgeSexTrendsMonth3Query): Promise<any> {
        const params = [];
        let newOnPrep = ` SELECT
            ageGroup DATIMAgeGroup,
            SUM(tested) TotalTested
        FROM AggregatePrepTestingAt3MonthRefill
        WHERE Year is not null
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
            newOnPrep = `${newOnPrep} and Sex IN ('${query.gender
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.datimAgeGroup) {
            newOnPrep = `${newOnPrep} and AgeGroup IN ('${query.datimAgeGroup
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.year) {
            newOnPrep = `${newOnPrep} and year = ${query.year}`;
        }

        if (query.month) {
            newOnPrep = `${newOnPrep} and month = ${query.month}`;
        }

        newOnPrep = `${newOnPrep} Group BY AgeGroup
        Order by AgeGroup`

        return await this.repository.query(newOnPrep, params);
    }
}
