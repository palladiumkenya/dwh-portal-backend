import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNumberOfClientWithAeQuery } from '../impl/get-number-of-client-with-ae.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeClients } from '../../entities/fact-trans-ae-clients.model';
import { Repository } from 'typeorm';

@QueryHandler(GetNumberOfClientWithAeQuery)
export class GetNumberOfClientWithAeHandler implements IQueryHandler<GetNumberOfClientWithAeQuery> {
    constructor(
        @InjectRepository(FactTransAeClients, 'mssql')
        private readonly repository: Repository<FactTransAeClients>
    ) {
    }

    async execute(query: GetNumberOfClientWithAeQuery): Promise<any> {
        const noOfClientsAdultsWithAe = this.repository.createQueryBuilder('f')
            .select('SUM([Total]) total')
            .where('[AgeGroup] NOT IN (\'Under 1\', \'1 to 4\', \'5 to 9\', \'10 to 14\')');

        if (query.county) {
            noOfClientsAdultsWithAe
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            noOfClientsAdultsWithAe
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            noOfClientsAdultsWithAe
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            noOfClientsAdultsWithAe
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            noOfClientsAdultsWithAe.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await noOfClientsAdultsWithAe.getRawOne();
    }
}
