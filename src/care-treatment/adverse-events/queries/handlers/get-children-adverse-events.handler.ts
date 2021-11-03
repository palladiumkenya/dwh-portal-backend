import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChildrenAdverseEventsQuery } from '../impl/get-children-adverse-events.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
import { Repository } from 'typeorm';

@QueryHandler(GetChildrenAdverseEventsQuery)
export class GetChildrenAdverseEventsHandler implements IQueryHandler<GetChildrenAdverseEventsQuery> {
    constructor(
        @InjectRepository(FactTransAdverseEvents, 'mssql')
        private readonly repository: Repository<FactTransAdverseEvents>
    ) {
    }

    async execute(query: GetChildrenAdverseEventsQuery): Promise<any> {
        const childrenAEs = this.repository.createQueryBuilder('f')
            .select('SUM([AdverseEvent_Total]) total, AgeGroup, Gender, CAST((cast(SUM([AdverseEvent_Total]) as decimal (9,2))/ (SUM(SUM([AdverseEvent_Total])) OVER (PARTITION BY AgeGroup ORDER BY AgeGroup))*100) as decimal(9,2))  AS adverseEventsByAgeGroup')
            .where('[AgeGroup] IN (\'Under 1\', \'1 to 4\', \'5 to 9\', \'10 to 14\')');

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
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            childrenAEs.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await childrenAEs
            .groupBy('AgeGroup, Gender')
            .getRawMany();
    }
}
