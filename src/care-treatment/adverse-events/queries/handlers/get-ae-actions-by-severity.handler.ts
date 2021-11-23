import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAeActionsBySeverityQuery } from '../impl/get-ae-actions-by-severity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
import { Repository } from 'typeorm';

@QueryHandler(GetAeActionsBySeverityQuery)
export class GetAeActionsBySeverityHandler implements IQueryHandler<GetAeActionsBySeverityQuery> {
    constructor(
        @InjectRepository(FactTransAdverseEvents, 'mssql')
        private readonly repository: Repository<FactTransAdverseEvents>
    ) {
    }

    async execute(query: GetAeActionsBySeverityQuery): Promise<any> {
        const aeActionsBySeverity = this.repository.createQueryBuilder('f')
            .select('[Severity], [AdverseEventActionTaken] = CASE \n' +
                '\t\t\t\t\t\t\tWHEN [AdverseEventActionTaken] = \'Select\' OR [AdverseEventActionTaken] IS NULL OR [AdverseEventActionTaken] = \'Other\' THEN \'Undocumented\' \n' +
                '\t\t\t\t\t\t\tWHEN [AdverseEventActionTaken] = \'Severe\' OR [AdverseEventActionTaken] = \'Mild\' OR [AdverseEventActionTaken] = \'Moderate\' THEN \'Undocumented\' \n' +
                '\t\t\t\t\t\t\tELSE [AdverseEventActionTaken] END,\n' +
                'SUM([AdverseEvent_Total]) total, AgeGroup ageGroup')
            .where('ISNULL([Severity],\'\') <> \'\'');

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

        return await aeActionsBySeverity
            .groupBy('Severity, AdverseEventActionTaken, AgeGroup')
            .getRawMany();
    }
}
