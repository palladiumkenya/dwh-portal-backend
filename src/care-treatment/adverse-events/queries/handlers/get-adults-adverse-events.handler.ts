import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAdultsAdverseEventsQuery } from '../impl/get-adults-adverse-events.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetAdultsAdverseEventsQuery)
export class GetAdultsAdverseEventsHandler implements IQueryHandler<GetAdultsAdverseEventsQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetAdultsAdverseEventsQuery): Promise<any> {
        const adultsAEs = this.repository
            .createQueryBuilder('f')
            .select(
                'SUM([AdverseEventsCount]) total, DATIMAgeGroup, Gender, CAST((cast(SUM([AdverseEventsCount]) as decimal (9,2))/ (SUM(SUM([AdverseEventsCount])) OVER (PARTITION BY DATIMAgeGroup ORDER BY DATIMAgeGroup))*100) as decimal(9,2))  AS adverseEventsByAgeGroup',
            )
            .where(
                "[DATIMAgeGroup] NOT IN (' Under 1', '01 to 04', '05 to 09', '10 to 14')",
            );

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
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultsAEs.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            adultsAEs.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            adultsAEs.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await adultsAEs.groupBy('DATIMAgeGroup, Gender').getRawMany();
    }
}
