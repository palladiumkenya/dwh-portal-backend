import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChildrenAdverseEventsQuery } from '../impl/get-children-adverse-events.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetChildrenAdverseEventsQuery)
export class GetChildrenAdverseEventsHandler implements IQueryHandler<GetChildrenAdverseEventsQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetChildrenAdverseEventsQuery): Promise<any> {
        const childrenAEs = this.repository
            .createQueryBuilder('f')
            .select(
                'SUM([AdverseEventCount]) total, DATIMAgeGroup, Gender, CAST((cast(SUM([AdverseEventCount]) as decimal (9,2))/ (SUM(SUM([AdverseEventCount])) OVER (PARTITION BY DATIMAgeGroup ORDER BY DATIMAgeGroup))*100) as decimal(9,2))  AS adverseEventsByAgeGroup',
            )
            .where("[DATIMAgeGroup] IN (' Under 1', '01 to 04', '05 to 09', '10 to 14')");

        if (query.county) {
            childrenAEs
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            childrenAEs
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            childrenAEs
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            childrenAEs
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            childrenAEs.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            childrenAEs.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            childrenAEs.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await childrenAEs
            .groupBy('DATIMAgeGroup, Gender')
            .getRawMany();
    }
}
