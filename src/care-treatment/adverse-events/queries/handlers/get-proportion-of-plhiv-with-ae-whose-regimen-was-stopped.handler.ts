import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedQuery } from '../impl/get-proportion-of-plhiv-with-ae-whose-regimen-was-stopped.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeActionDrug } from '../../entities/fact-trans-ae-action-drug.model';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedQuery)
export class GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedHandler implements IQueryHandler<GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedQuery): Promise<any> {
        const proportionOfPLHIVWithAeWhoseRegimenWasStopped = this.repository
            .createQueryBuilder('f')
            .select(
                'AdverseEventActionTaken adverseEventActionTaken, SUM(AdverseEventCount) numberOfPatientsAe',
            )
            .andWhere('f.AdverseEventActionTaken = (:...AdverseEventActionTaken)', {
                AdverseEventActionTaken: ['All drugs stopped'],
            });

        if (query.county) {
            proportionOfPLHIVWithAeWhoseRegimenWasStopped.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionOfPLHIVWithAeWhoseRegimenWasStopped.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.partner) {
            proportionOfPLHIVWithAeWhoseRegimenWasStopped.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.facility) {
            proportionOfPLHIVWithAeWhoseRegimenWasStopped.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            proportionOfPLHIVWithAeWhoseRegimenWasStopped.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionOfPLHIVWithAeWhoseRegimenWasStopped.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionOfPLHIVWithAeWhoseRegimenWasStopped.andWhere(
                'f.Gender IN (:...genders)',
                { genders: query.gender },
            );
        }

        return await proportionOfPLHIVWithAeWhoseRegimenWasStopped
            .groupBy('f.AdverseEventActionTaken')
            .getRawOne();
    }
}
