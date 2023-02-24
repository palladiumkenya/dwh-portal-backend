import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivCumulativeQuery } from '../impl/get-covid-adult-plhiv-cumulative.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCovidAdultPlhivCumulativeQuery)
export class GetCovidAdultPLHIVCumulativeHandler implements IQueryHandler<GetCovidAdultPlhivCumulativeQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }
//TODO:: FInd out why
    async execute(query: GetCovidAdultPlhivCumulativeQuery): Promise<any> {

    }
}
