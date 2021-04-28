import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportedAesWithSeverityLevelsQuery } from '../impl/get-reported-aes-with-severity-levels.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeCategories } from '../../entities/fact-trans-ae-categories.model';
import { Repository } from 'typeorm';

@QueryHandler(GetReportedAesWithSeverityLevelsQuery)
export class GetReportedAesWithSeverityLevelsHandler implements IQueryHandler<GetReportedAesWithSeverityLevelsQuery> {
    constructor(
        @InjectRepository(FactTransAeCategories, 'mssql')
        private readonly repository: Repository<FactTransAeCategories>
    ) {
    }

    async execute(query: GetReportedAesWithSeverityLevelsQuery): Promise<any> {
        const reportedAesWithSeverity = this.repository.createQueryBuilder('f')
            .select('[AdverseEvent], [Severity] = CASE WHEN ISNULL([Severity],\'\') = \'\' THEN \'Unknown\' ELSE [Severity] END, SUM([Severity_total]) total, DATIM_AgeGroup ageGroup')
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

        return await reportedAesWithSeverity
            .groupBy('[AdverseEvent], [Severity], DATIM_AgeGroup')
            .orderBy('SUM([Severity_total])')
            .getRawMany();
    }
}
