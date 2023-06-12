import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesAmongAlhivWithSustainedSuppressionQuery } from '../impl/get-otz-outcomes-among-alhiv-with-sustained-suppression.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOTZOutcome } from '../../entities/aggregate-otz-outcome.model';

@QueryHandler(GetOtzOutcomesAmongAlhivWithSustainedSuppressionQuery)
export class GetOtzOutcomesAmongAlhivWithSustainedSuppressionHandler implements IQueryHandler<GetOtzOutcomesAmongAlhivWithSustainedSuppressionQuery> {
    constructor(
        @InjectRepository(AggregateOTZOutcome, 'mssql')
        private readonly repository: Repository<AggregateOTZOutcome>
    ) {
    }

    async execute(query: GetOtzOutcomesAmongAlhivWithSustainedSuppressionQuery): Promise<any> {

    }
}