import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPrep } from '../../entities/fact-prep.model';
import { GetPrepEligibleAgegroupQuery } from '../impl/get-prep-eligible-agegroup.query';

@QueryHandler(GetPrepEligibleAgegroupQuery)
export class GetPrepEligibleByAgegroupHandler
    implements IQueryHandler<GetPrepEligibleAgegroupQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetPrepEligibleAgegroupQuery): Promise<any> {
        const params = [];
        let newOnPrep = `SELECT
                AgeGroup DATIMAgeGroup,
                Sum(EligiblePrep) As EligiblePrep
            from AggregatePrepCascade prep
            where Year is not null
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
            newOnPrep = `${newOnPrep} and Year = ${query.year}`;
        }

        if (query.month) {
            newOnPrep = `${newOnPrep} and Month = ${query.month}`;
        }

        newOnPrep = `${newOnPrep} GROUP BY AgeGroup`;

        return await this.repository.query(newOnPrep, params);
    }
}
