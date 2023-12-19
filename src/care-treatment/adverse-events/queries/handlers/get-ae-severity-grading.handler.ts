import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAeSeverityGradingQuery } from '../impl/get-ae-severity-grading.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAdverseEvents } from '../../entities/fact-trans-adverse-events.model';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetAeSeverityGradingQuery)
export class GetAeSeverityGradingHandler
    implements IQueryHandler<GetAeSeverityGradingQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>,
    ) {}

    async execute(query: GetAeSeverityGradingQuery): Promise<any> {
        const aeSeverityGrading = this.repository
            .createQueryBuilder('f')
            .select(
                '[Severity], DATIMAgeGroup ageGroup, SUM([AdverseEventsCount]) total',
            )
            .where("ISNULL([Severity],'') <> ''");

        if (query.county) {
            aeSeverityGrading.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            aeSeverityGrading.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            aeSeverityGrading.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            aeSeverityGrading.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            aeSeverityGrading.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            aeSeverityGrading.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            aeSeverityGrading.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await aeSeverityGrading
            .groupBy('Severity, DATIMAgeGroup')
            .getRawMany();
    }
}
