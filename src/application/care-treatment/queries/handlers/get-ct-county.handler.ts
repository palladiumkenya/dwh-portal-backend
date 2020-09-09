import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtCountyQuery } from '../get-ct-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtCountyQuery)
export class GetCtCountyHandler implements IQueryHandler<GetCtCountyQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select(['distinct [County] county'])
            .orderBy('f.[County]');

        return await activeArt.getRawMany();
    }
}
