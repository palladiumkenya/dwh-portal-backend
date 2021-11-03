import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportedAesWithSeverityLevelsQuery } from '../impl/get-reported-aes-with-severity-levels.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
import { Repository } from 'typeorm';

@QueryHandler(GetReportedAesWithSeverityLevelsQuery)
export class GetReportedAesWithSeverityLevelsHandler implements IQueryHandler<GetReportedAesWithSeverityLevelsQuery> {
    constructor(
        @InjectRepository(FactTransAdverseEvents, 'mssql')
        private readonly repository: Repository<FactTransAdverseEvents>
    ) {
    }

    async execute(query: GetReportedAesWithSeverityLevelsQuery): Promise<any> {
        const reportedAesWithSeverity = this.repository.createQueryBuilder('f')
            .select('[AdverseEvent], [Severity] = CASE WHEN ISNULL([Severity],\'\') = \'\' THEN \'Unknown\' ELSE [Severity] END, SUM([AdverseEvent_Total]) total, AgeGroup ageGroup')
            .where('[AdverseEvent] IS NOT NULL');

        if (query.county) {
            reportedAesWithSeverity
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            reportedAesWithSeverity
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            reportedAesWithSeverity
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            reportedAesWithSeverity
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            reportedAesWithSeverity.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await reportedAesWithSeverity
            .groupBy('[AdverseEvent], [Severity], AgeGroup')
            .orderBy('SUM([AdverseEvent_Total])')
            .getRawMany();
    }
}
