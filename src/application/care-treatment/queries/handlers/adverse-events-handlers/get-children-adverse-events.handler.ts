import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChildrenAdverseEventsQuery } from '../../adverse-events-queries/get-children-adverse-events.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAdverseEvents } from '../../../../../entities/care_treatment/fact-trans-adverse-events.model';
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
            .select('SUM([AdverseEvent_Total]) total, AgeGroup, Gender')
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
                .andWhere('f.CTPartner IN (:...partners)', { facilities: query.partner });
        }

        return await childrenAEs
            .groupBy('AgeGroup, Gender')
            .getRawMany();
    }
}
