import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesAmongAlhivWithReSuppressionQuery } from '../impl/get-otz-outcomes-among-alhiv-with-re-suppression.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOtzOutcomesAmongAlhivWithReSuppressionQuery)
export class GetOtzOutcomesAmongAlhivWithReSuppressionHandler implements IQueryHandler<GetOtzOutcomesAmongAlhivWithReSuppressionQuery> {
    constructor(
        @InjectRepository(FactTransOtzOutcome, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOtzOutcomesAmongAlhivWithReSuppressionQuery): Promise<any> {

    }
}