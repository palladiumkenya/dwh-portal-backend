import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAeSeverityGradingQuery } from '../impl/get-ae-severity-grading.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeSeverity } from '../../entities/fact-trans-ae-severity.model';
import { Repository } from 'typeorm';

@QueryHandler(GetAeSeverityGradingQuery)
export class GetAeSeverityGradingHandler implements IQueryHandler<GetAeSeverityGradingQuery> {
    constructor(
        @InjectRepository(FactTransAeSeverity, 'mssql')
        private readonly repository: Repository<FactTransAeSeverity>
    ) {
    }

    async execute(query: GetAeSeverityGradingQuery): Promise<any> {
        const aeSeverityGrading = this.repository.createQueryBuilder('f')
            .select('[Severity], DATIM_AgeGroup ageGroup, SUM([Severity_Total]) total')
            .where('ISNULL([Severity],\'\') <> \'\'');

        if (query.county) {
            aeSeverityGrading
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            aeSeverityGrading
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            aeSeverityGrading
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            aeSeverityGrading
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await aeSeverityGrading
            .groupBy('Severity, DATIM_AgeGroup')
            .getRawMany();
    }
}
