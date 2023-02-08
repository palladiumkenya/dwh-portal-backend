import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAeActionsBySeverityQuery } from '../impl/get-ae-actions-by-severity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetAeActionsBySeverityQuery)
export class GetAeActionsBySeverityHandler implements IQueryHandler<GetAeActionsBySeverityQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetAeActionsBySeverityQuery): Promise<any> {
        const aeActionsBySeverity = this.repository
            .createQueryBuilder('f')
            .select(
                '[Severity], [AdverseEventActionTaken] = CASE ' +
                    "WHEN [AdverseEventActionTaken] = 'Select' OR [AdverseEventActionTaken] IS NULL OR [AdverseEventActionTaken] = 'Other' THEN 'Undocumented' " +
                    "WHEN [AdverseEventActionTaken] = 'Severe' OR [AdverseEventActionTaken] = 'Mild' OR [AdverseEventActionTaken] = 'Moderate' THEN 'Undocumented' " +
                    'ELSE [AdverseEventActionTaken] END,' +
                    'SUM([AdverseEventCount]) total, DATIMAgeGroup ageGroup',
            )
            .where("ISNULL([Severity],'') <> ''");

        if (query.county) {
            aeActionsBySeverity
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            aeActionsBySeverity
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            aeActionsBySeverity
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            aeActionsBySeverity
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            aeActionsBySeverity.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            aeActionsBySeverity.andWhere('f.DATIMAgeGroup IN (:...ageGroup)', { ageGroup: query.datimAgeGroup });
        }

        if (query.gender) {
            aeActionsBySeverity.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await aeActionsBySeverity
            .groupBy('Severity, AdverseEventActionTaken, DATIMAgeGroup')
            .getRawMany();
    }
}
