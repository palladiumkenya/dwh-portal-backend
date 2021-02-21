import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAdverseEventsQuery } from '../impl/get-adverse-events.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
import { Repository } from 'typeorm';

@QueryHandler(GetAdverseEventsQuery)
export class GetAdverseEventsHandler implements IQueryHandler<GetAdverseEventsQuery> {
    constructor(
        @InjectRepository(FactTransAdverseEvents, 'mssql')
        private readonly repository: Repository<FactTransAdverseEvents>
    ) {
    }

    async execute(query: GetAdverseEventsQuery): Promise<any> {
        const adultsAEs = this.repository.createQueryBuilder('f')
            .select('SUM([AdverseEvent_Total]) total, AgeGroup, Gender, CAST((cast(SUM([AdverseEvent_Total]) as decimal (9,2))/ (SUM(SUM([AdverseEvent_Total])) OVER (PARTITION BY AgeGroup ORDER BY AgeGroup))*100) as decimal(9,2))  AS adverseEventsByAgeGroup')
            .where('[AgeGroup] IS NOT NULL');

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
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await adultsAEs
            .groupBy('AgeGroup, Gender')
            .getRawMany();
    }
}
