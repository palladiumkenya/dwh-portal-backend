import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesAmongAlhivWithSustainedSuppressionQuery } from '../impl/get-otz-outcomes-among-alhiv-with-sustained-suppression.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzOutcome } from '../../entities/fact-trans-otz-outcome.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzOutcomesAmongAlhivWithSustainedSuppressionQuery)
export class GetOtzOutcomesAmongAlhivWithSustainedSuppressionHandler implements IQueryHandler<GetOtzOutcomesAmongAlhivWithSustainedSuppressionQuery> {
    constructor(
        @InjectRepository(FactTransOtzOutcome, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOtzOutcomesAmongAlhivWithSustainedSuppressionQuery): Promise<any> {

    }
}