import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNumberOfClientChildrenWithAeQuery } from '../impl/get-number-of-client-children-with-ae.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeClients } from '../../entities/fact-trans-ae-clients.model';
import { Repository } from 'typeorm';

@QueryHandler(GetNumberOfClientChildrenWithAeQuery)
export class GetNumberOfClientChildrenWithAeHandler implements IQueryHandler<GetNumberOfClientChildrenWithAeQuery> {
    constructor(
        @InjectRepository(FactTransAeClients, 'mssql')
        private readonly repository: Repository<FactTransAeClients>
    ) {
    }


    async execute(query: GetNumberOfClientChildrenWithAeQuery): Promise<any> {
        const noOfClientsChildrenWithAe = this.repository.createQueryBuilder('f')
            .select('SUM([Total]) total')
            .where('[AgeGroup] IN (\'Under 1\', \'1 to 4\', \'5 to 9\', \'10 to 14\')');

        if (query.county) {
            noOfClientsChildrenWithAe
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            noOfClientsChildrenWithAe
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            noOfClientsChildrenWithAe
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            noOfClientsChildrenWithAe
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            noOfClientsChildrenWithAe.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await noOfClientsChildrenWithAe.getRawOne();
    }
}
