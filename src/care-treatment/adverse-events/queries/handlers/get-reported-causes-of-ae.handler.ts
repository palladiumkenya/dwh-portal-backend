import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportedCausesOfAeQuery } from '../impl/get-reported-causes-of-ae.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeCauses } from '../../entities/fact-trans-ae-causes.model';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetReportedCausesOfAeQuery)
export class GetReportedCausesOfAeHandler implements IQueryHandler<GetReportedCausesOfAeQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetReportedCausesOfAeQuery): Promise<any> {
        const reportedCausesOfAes = this.repository
            .createQueryBuilder('f')
            .select('[AdverseEventCause], SUM([AdverseEventsCountt]) total')
            .where('[AdverseEventCause] IS NOT NULL');

        if (query.county) {
            reportedCausesOfAes
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            reportedCausesOfAes
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            reportedCausesOfAes
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            reportedCausesOfAes
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            reportedCausesOfAes.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            reportedCausesOfAes.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            reportedCausesOfAes.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await reportedCausesOfAes
            .groupBy('AdverseEventCause')
            .getRawMany();
    }
}
