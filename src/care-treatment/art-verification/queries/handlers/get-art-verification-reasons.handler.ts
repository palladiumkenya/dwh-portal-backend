import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { GetArtVerificationReasonsQuery } from './../impl/get-art-verification-reasons.query';

@QueryHandler(GetArtVerificationReasonsQuery)
export class GetArtVerificationReasonsHandler
    implements IQueryHandler<GetArtVerificationReasonsQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>,
    ) {}

    async execute(query: GetArtVerificationReasonsQuery): Promise<any> {
        let params = [];
        const nonReasons = `
            Select
                count(*) NUM, non_verification_reason
                FROM [pSurvey].[dbo].[stg_questionnaire_responses]
				group by non_verification_reason
                order by count(*);
        `;

        if (query.county) {
            params.push(query.county);
        }

        if (query.subCounty) {
            params.push(query.subCounty);
        }

        if (query.facility) {
            params.push(query.facility);
        }

        if (query.partner) {
            params.push(query.partner);
        }

        if (query.agency) {
            params.push(query.agency);
        }

        return await this.repository.query(nonReasons, params);
    }
}
