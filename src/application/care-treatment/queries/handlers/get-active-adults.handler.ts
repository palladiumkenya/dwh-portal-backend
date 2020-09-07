import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetActiveAdultsQuery } from '../get-active-adults.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetActiveAdultsQuery)
export class GetActiveAdultsHandler implements IQueryHandler<GetActiveAdultsQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select('SUM(f.[TXCURR_Total])', 'ActiveARTAdults')
            .where("f.[ageGroup] NOT IN ('10-14', '<1', '1-4', '5-9')");

        return await activeArt.getRawMany();
    }
}
