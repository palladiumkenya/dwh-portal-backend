import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfPLHIVWithAeWhoseRegimenChangedQuery } from '../impl/get-proportion-of-plhiv-with-ae-whose-regimen-changed.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from '../../entities/aggregate-adverse-events.model';

@QueryHandler(GetProportionOfPLHIVWithAeWhoseRegimenChangedQuery)
export class GetProportionOfPLHIVWithAeWhoseRegimenChangedHandler implements IQueryHandler<GetProportionOfPLHIVWithAeWhoseRegimenChangedQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetProportionOfPLHIVWithAeWhoseRegimenChangedQuery): Promise<any> {
        const proportionOfPLHIVWithAeWhoseRegimenChanged = this.repository
            .createQueryBuilder('f')
            .select(
                'AdverseEventActionTaken adverseEventActionTaken, SUM(AdverseEventsCount) numberOfPatientsAe',
            )
            .andWhere(
                `f.AdverseEventActionTaken in ('Medicine causing AE substituted/withdrawn', 'SUBSTITUTED DRUG|SUBSTITUTED DRUG', 'Drug Substituted', 'Drug Withdrawn')`,
            );

        if (query.county) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.partner) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.facility) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere(
                'f.Sex IN (:...genders)',
                { genders: query.gender },
            );
        }


        return await proportionOfPLHIVWithAeWhoseRegimenChanged
            .groupBy('f.AdverseEventActionTaken')
            .getRawOne();
    }
}
