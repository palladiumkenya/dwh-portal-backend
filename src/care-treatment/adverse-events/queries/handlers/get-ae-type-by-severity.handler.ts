import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAeTypeBySeverityQuery } from '../impl/get-ae-type-by-severity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetAeTypeBySeverityQuery)
export class GetAeTypeBySeverityHandler implements IQueryHandler<GetAeTypeBySeverityQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetAeTypeBySeverityQuery): Promise<any> {
        const aeTypesBySeverity = this.repository
            .createQueryBuilder('f')
            .select(
                '[Severity], [AdverseEvent], SUM([AdverseEventsCount]) total',
            )
            .where("ISNULL([Severity],'') <> ''");

        if (query.county) {
            aeTypesBySeverity
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            aeTypesBySeverity
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            aeTypesBySeverity
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            aeTypesBySeverity
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            aeTypesBySeverity.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            aeTypesBySeverity.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            aeTypesBySeverity.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await aeTypesBySeverity
            .groupBy('Severity, AdverseEvent')
            .getRawMany();
    }
}
