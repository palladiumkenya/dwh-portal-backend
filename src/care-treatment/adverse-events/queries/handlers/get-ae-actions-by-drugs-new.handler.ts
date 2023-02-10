import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAeActionsByDrugsNewQuery } from '../impl/get-ae-actions-by-drugs-new.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeActionDrug } from '../../entities/fact-trans-ae-action-drug.model';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetAeActionsByDrugsNewQuery)
export class GetAeActionsByDrugsNewHandler implements IQueryHandler<GetAeActionsByDrugsNewQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetAeActionsByDrugsNewQuery): Promise<any> {
        const aeActionsByDrugsNew = this.repository
            .createQueryBuilder('f')
            .select(
                '[AdverseEventCause], [AdverseEventActionTaken], SUM([AdverseEventCount]) total, DATIMAgeGroup ageGroup',
            )
            .where('[MFLCode] > 0')
            .andWhere('[AdverseEventCause] IS NOT NULL')
            .andWhere('[AdverseEventActionTaken] IS NOT NULL')
            .andWhere(
                'f.AdverseEventActionTaken NOT IN (:...AdverseEventActionTaken)',
                { AdverseEventActionTaken: ['Other', 'Select'] },
            );

        if (query.county) {
            aeActionsByDrugsNew
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            aeActionsByDrugsNew
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            aeActionsByDrugsNew
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            aeActionsByDrugsNew
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            aeActionsByDrugsNew.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            aeActionsByDrugsNew.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            aeActionsByDrugsNew.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await aeActionsByDrugsNew
            .groupBy('[AdverseEventCause], [AdverseEventActionTaken], DATIMAgeGroup')
            .orderBy('[AdverseEventCause], [AdverseEventActionTaken]')
            .getRawMany();
    }
}
