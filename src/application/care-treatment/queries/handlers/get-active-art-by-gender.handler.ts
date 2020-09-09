import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetActiveArtByGenderQuery } from '../get-active-art-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetActiveArtByGenderQuery)
export class GetActiveArtByGenderHandler implements IQueryHandler<GetActiveArtByGenderQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(): Promise<any> {
        const activeArt = this.repository.createQueryBuilder('f')
            .select(['SUM([TXCURR_Total]) ActiveART,[Gender]'])
            .groupBy('[Gender]');

        return await activeArt.getRawMany();
    }
}
