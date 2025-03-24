import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredQuery } from '../impl/get-proportion-of-plhiv-with-ae-whose-regimen-was-not-altered.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from '../../entities/aggregate-adverse-events.model';

@QueryHandler(GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredQuery)
export class GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredHandler implements IQueryHandler<GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredQuery): Promise<any> {
        const proportionOfPLHIVWithAeWhoseRegimenNotAltered = this.repository
            .createQueryBuilder('f')
            .select(
                'AdverseEventActionTaken adverseEventActionTaken, SUM(AdverseEventsCount) numberOfPatientsAe',
            )
            .andWhere('f.AdverseEventActionTaken in (:...AdverseEventActionTaken)', {
                AdverseEventActionTaken: ['Medicine not changed', 'Drug not Changed'],
            });

        if (query.county) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.partner) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.facility) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionOfPLHIVWithAeWhoseRegimenNotAltered.andWhere(
                'f.Sex IN (:...genders)',
                { genders: query.gender },
            );
        }

        return await proportionOfPLHIVWithAeWhoseRegimenNotAltered
            .groupBy('f.AdverseEventActionTaken')
            .getRawOne();
    }
}
