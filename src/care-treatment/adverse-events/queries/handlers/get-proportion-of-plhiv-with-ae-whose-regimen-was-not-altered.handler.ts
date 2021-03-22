import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredQuery } from '../impl/get-proportion-of-plhiv-with-ae-whose-regimen-was-not-altered.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeActionDrug } from '../../entities/fact-trans-ae-action-drug.model';
import { Repository } from 'typeorm';

@QueryHandler(GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredQuery)
export class GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredHandler implements IQueryHandler<GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredQuery> {
    constructor(
        @InjectRepository(FactTransAeActionDrug, 'mssql')
        private readonly repository: Repository<FactTransAeActionDrug>
    ) {
    }

    async execute(query: GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredQuery): Promise<any> {
        const proportionOfPLHIVWithAeWhoseRegimenNotAltered = this.repository.createQueryBuilder('f')
            .select('AdverseEventActionTaken adverseEventActionTaken, SUM(AdverseEventCause_Total) numberOfPatientsAe')
            .andWhere('f.AdverseEventActionTaken = :AdverseEventActionTaken', { AdverseEventActionTaken: "Medicine not changed"});

        if (query.county) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.partner) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.facility) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        return await proportionOfPLHIVWithAeWhoseRegimenNotAltered
            .groupBy('f.AdverseEventActionTaken')
            .getRawOne();
    }
}
