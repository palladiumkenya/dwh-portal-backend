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
        let newOnPrep = ` SELECT
            sum(Tested) tested, Sum(nottested) nottested 
        FROM [dbo].[AggegateTestingAt1MonthRefill]
        WHERE MFLCode is not null
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

        if (query.ageGroup) {
            newOnPrep = `${newOnPrep} and ageGroup IN ('${query.ageGroup
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.year) {
            newOnPrep = `${newOnPrep} and year = ${query.year}`;
        }

        if (query.month) {
            newOnPrep = `${newOnPrep} and month = ${query.month}`;
        }

        newOnPrep = `${newOnPrep} 
            GROUP BY ageGroup
            Order by ageGroup`

        return await this.repository.query(newOnPrep, params);
    }
}
