import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetActiveArtQuery } from '../get-active-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';

@QueryHandler(GetActiveArtQuery)
export class GetActiveArtHandler implements IQueryHandler<GetActiveArtQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetActiveArtQuery): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select('SUM(f.[TXCURR_Total])', 'ActiveART')
            .where('f.[TXCURR_Total] > 0');

        return await activeArt.getRawMany();
    }
}
