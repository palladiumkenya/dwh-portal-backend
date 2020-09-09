import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { GetActiveArtAdolescentsQuery } from '../get-active-art-adolescents.query';

@QueryHandler(GetActiveArtAdolescentsQuery)
export class GetActiveArtAdolescentsHandler implements IQueryHandler<GetActiveArtAdolescentsQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select('SUM(f.[TXCURR_Total])', 'ActiveARTAdolescents')
            .where("f.[ageGroup] IN ('10-14', '15-19')");

        return await activeArt.getRawMany();
    }
}
