import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAdultsAdverseEventsQuery } from '../impl/get-adults-adverse-events.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
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
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultsAEs.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            adultsAEs.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            adultsAEs.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await adultsAEs
            .groupBy('AgeGroup, Gender')
            .getRawMany();
    }
}
