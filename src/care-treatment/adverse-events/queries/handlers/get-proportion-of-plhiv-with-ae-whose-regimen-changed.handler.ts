import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfPLHIVWithAeWhoseRegimenChangedQuery } from '../impl/get-proportion-of-plhiv-with-ae-whose-regimen-changed.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransAeActionDrug } from '../../entities/fact-trans-ae-action-drug.model';

@QueryHandler(GetProportionOfPLHIVWithAeWhoseRegimenChangedQuery)
export class GetProportionOfPLHIVWithAeWhoseRegimenChangedHandler implements IQueryHandler<GetProportionOfPLHIVWithAeWhoseRegimenChangedQuery> {
    constructor(
        @InjectRepository(FactTransAeActionDrug, 'mssql')
        private readonly repository: Repository<FactTransAeActionDrug>
    ) {
    }

    async execute(query: GetProportionOfPLHIVWithAeWhoseRegimenChangedQuery): Promise<any> {
        const proportionOfPLHIVWithAeWhoseRegimenChanged = this.repository.createQueryBuilder('f')
            .select('AdverseEventActionTaken adverseEventActionTaken, SUM(AdverseEventCause_Total) numberOfPatientsAe')
            .andWhere('f.AdverseEventActionTaken = :AdverseEventActionTaken', { AdverseEventActionTaken: "Medicine causing AE substituted/withdrawn"});

        if (query.county) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.partner) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.facility) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            // lacking gender
            // proportionOfPLHIVWithAeWhoseRegimenChanged.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await proportionOfPLHIVWithAeWhoseRegimenChanged
            .groupBy('f.AdverseEventActionTaken')
            .getRawOne();
    }
}
