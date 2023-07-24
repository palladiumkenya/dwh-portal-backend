import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPrep } from '../../entities/fact-prep.model';
import { GetPrepEligibleTrendsQuery } from './../impl/get-prep-eligible-trends.query';

@QueryHandler(GetPrepEligibleTrendsQuery)
export class GetPrepEligibleTrendsHandler
    implements IQueryHandler<GetPrepEligibleTrendsQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetPrepEligibleTrendsQuery): Promise<any> {
        const params = [];
        let newOnPrep = `SELECT
                AssMonth month,
                AssYear year,
                Sum(EligiblePrep) As EligiblePrep
            from AggregatePrepCascade prep
            where AssYear is not null
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
            newOnPrep = `${newOnPrep} and AgeGroup IN ('${query.datimAgeGroup
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.year) {
            newOnPrep = `${newOnPrep} and AssYear = ${query.year}`;
        }

        if (query.month) {
            newOnPrep = `${newOnPrep} and AssMonth = ${query.month}`;
        }

        newOnPrep = `${newOnPrep} GROUP BY AssMonth, AssYear
						ORDER BY AssYear Desc, AssMonth DESC`;

        return await this.repository.query(newOnPrep, params);
    }
}
