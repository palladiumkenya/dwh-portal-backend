import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetActiveChildrenQuery } from '../get-active-children.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetActiveChildrenQuery)
export class GetActiveChildrenHandler implements IQueryHandler<GetActiveChildrenQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select('SUM(f.[TXCURR_Total])', 'ActiveARTChildren')
            .where("f.[ageGroup] IN ('10-14', '<1', '1-4', '5-9')");

        return await activeArt.getRawMany();
    }
}
