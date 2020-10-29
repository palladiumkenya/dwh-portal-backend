import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAdultsAdverseEventsQuery } from '../../adverse-events-queries/get-adults-adverse-events.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAdverseEvents } from '../../../../../entities/care_treatment/fact-trans-adverse-events.model';
import { Repository } from 'typeorm';

@QueryHandler(GetAdultsAdverseEventsQuery)
export class GetAdultsAdverseEventsHandler implements IQueryHandler<GetAdultsAdverseEventsQuery> {
    constructor(
        @InjectRepository(FactTransAdverseEvents, 'mssql')
        private readonly repository: Repository<FactTransAdverseEvents>
    ) {
    }

    async execute(query: GetAdultsAdverseEventsQuery): Promise<any> {
        const adultsAEs = this.repository.createQueryBuilder('f')
            .select('SUM([AdverseEvent_Total]) total, AgeGroup, Gender, CAST((cast(SUM([AdverseEvent_Total]) as decimal (9,2))/ (SUM(SUM([AdverseEvent_Total])) OVER (PARTITION BY AgeGroup ORDER BY AgeGroup))*100) as decimal(9,2))  AS adverseEventsByAgeGroup')
            .where('[AgeGroup] NOT IN (\'Under 1\', \'1 to 4\', \'5 to 9\', \'10 to 14\')');

        if (query.county) {
            adultsAEs
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultsAEs
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultsAEs
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultsAEs
                .andWhere('f.CTPartner IN (:...partners)', { facilities: query.partner });
        }

        return await adultsAEs
            .groupBy('AgeGroup, Gender')
            .getRawMany();
    }
}
