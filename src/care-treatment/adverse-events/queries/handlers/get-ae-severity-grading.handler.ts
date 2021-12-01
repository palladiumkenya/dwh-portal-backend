import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAeSeverityGradingQuery } from '../impl/get-ae-severity-grading.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
import { Repository } from 'typeorm';

@QueryHandler(GetAeSeverityGradingQuery)
export class GetAeSeverityGradingHandler implements IQueryHandler<GetAeSeverityGradingQuery> {
    constructor(
        @InjectRepository(FactTransAdverseEvents, 'mssql')
        private readonly repository: Repository<FactTransAdverseEvents>
    ) {
    }

    async execute(query: GetAeSeverityGradingQuery): Promise<any> {
        const aeSeverityGrading = this.repository.createQueryBuilder('f')
            .select('[Severity], AgeGroup ageGroup, SUM([AdverseEvent_Total]) total')
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

        if (query.agency) {
            aeSeverityGrading.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            aeSeverityGrading.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            aeSeverityGrading.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await aeSeverityGrading
            .groupBy('Severity, AgeGroup')
            .getRawMany();
    }
}
