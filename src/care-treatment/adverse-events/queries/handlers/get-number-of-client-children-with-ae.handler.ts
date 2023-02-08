import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNumberOfClientChildrenWithAeQuery } from '../impl/get-number-of-client-children-with-ae.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetNumberOfClientChildrenWithAeQuery)
export class GetNumberOfClientChildrenWithAeHandler implements IQueryHandler<GetNumberOfClientChildrenWithAeQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }


    async execute(query: GetNumberOfClientChildrenWithAeQuery): Promise<any> {
        const noOfClientsChildrenWithAe = this.repository
            .createQueryBuilder('f')
            .select('SUM([AdverseClientsCount]) total')
            .where(
                "[DATIMAgeGroup] IN ('Under 1', '1 to 4', '5 to 9', '10 to 14')",
            );

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

        if (query.datimAgeGroup) {
            noOfClientsChildrenWithAe.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            noOfClientsChildrenWithAe.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await noOfClientsChildrenWithAe.getRawOne();
    }
}
