import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
import { GetNumberAeReportedInChildrenOver15Query } from '../impl/get-number-ae-reported-in-children-over-15.query';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetNumberAeReportedInChildrenOver15Query)
export class GetNumberAeReportedInChildrenOver15Handler implements IQueryHandler<GetNumberAeReportedInChildrenOver15Query> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetNumberAeReportedInChildrenOver15Query): Promise<any> {
        const noOfReportedAeinChildren = this.repository
            .createQueryBuilder('f')
            .select('SUM([AdverseEventsCount]) total')
            .where("[DATIMAgeGroup] IN (' Under 1', '01 to 04', '05 to 09', '10 to 14')");

        if (query.county) {
            noOfReportedAeinChildren
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            noOfReportedAeinChildren
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            noOfReportedAeinChildren
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            noOfReportedAeinChildren
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            noOfReportedAeinChildren.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            noOfReportedAeinChildren.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            noOfReportedAeinChildren.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await noOfReportedAeinChildren.getRawOne();
    }
}
