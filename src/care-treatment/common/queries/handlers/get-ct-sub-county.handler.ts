import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtSubCountyQuery } from '../impl/get-ct-sub-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtSubCountyQuery)
export class GetCtSubCountyHandler implements IQueryHandler<GetCtSubCountyQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtSubCountyQuery): Promise<any> {
        const subCounties = this.repository.createQueryBuilder('f')
            .select(['distinct [Subcounty] subcounty'])
            .where('f.[Subcounty] IS NOT NULL');

        if (query.county) {
            subCounties
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        return await subCounties
            .orderBy('f.Subcounty')
            .getRawMany();
    }
}
