import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedQuery } from '../impl/get-proportion-of-plhiv-with-ae-whose-regimen-was-stopped.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeActionDrug } from '../../entities/fact-trans-ae-action-drug.model';
import { Repository } from 'typeorm';

@QueryHandler(GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedQuery)
export class GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedHandler implements IQueryHandler<GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedQuery> {
    constructor(
        @InjectRepository(FactTransAeActionDrug, 'mssql')
        private readonly repository: Repository<FactTransAeActionDrug>
    ) {
    }

    async execute(query: GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedQuery): Promise<any> {
        const proportionOfPLHIVWithAeWhoseRegimenWasStopped = this.repository.createQueryBuilder('f')
            .select('AdverseEventActionTaken adverseEventActionTaken, SUM(AdverseEventCause_Total) numberOfPatientsAe')
            .andWhere('f.AdverseEventActionTaken = :AdverseEventActionTaken', { AdverseEventActionTaken: "All drugs stopped"});

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

        return await proportionOfPLHIVWithAeWhoseRegimenWasStopped
            .groupBy('f.AdverseEventActionTaken')
            .getRawOne();
    }
}
