import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNumberOfClientWithAeQuery } from '../impl/get-number-of-client-with-ae.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetNumberOfClientWithAeQuery)
export class GetNumberOfClientWithAeHandler implements IQueryHandler<GetNumberOfClientWithAeQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetNumberOfClientWithAeQuery): Promise<any> {
        const noOfClientsAdultsWithAe = this.repository
            .createQueryBuilder('f')
            .select('SUM([AdverseClientsCount]) total')
            .where(
                "[DATIMAgeGroup] NOT IN ('Under 1', '1 to 4', '5 to 9', '10 to 14')",
            );

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
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            noOfClientsAdultsWithAe.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            noOfClientsAdultsWithAe.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            noOfClientsAdultsWithAe.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await noOfClientsAdultsWithAe.getRawOne();
    }
}
