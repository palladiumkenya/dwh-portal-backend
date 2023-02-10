import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAeActionsByDrugsQuery } from '../impl/get-ae-actions-by-drugs.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeCauses } from '../../entities/fact-trans-ae-causes.model';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetAeActionsByDrugsQuery)
export class GetAeActionsByDrugsHandler implements IQueryHandler<GetAeActionsByDrugsQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetAeActionsByDrugsQuery): Promise<any> {
        const aeActionsByDrugs = this.repository
            .createQueryBuilder('f')
            .select(
                '[Severity], [AdverseEventCause], SUM([AdverseEventCount]) total, DATIMAgeGroup ageGroup',
            )
            .where('[AdverseEventCause] IS NOT NULL');

        if (query.county) {
            aeActionsByDrugs
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            aeActionsByDrugs
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            aeActionsByDrugs
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            aeActionsByDrugs
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            aeActionsByDrugs.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            aeActionsByDrugs.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            aeActionsByDrugs.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await aeActionsByDrugs
            .groupBy('[Severity], [AdverseEventCause], DATIMAgeGroup')
            .getRawMany();
    }
}
