import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsQuery } from '../impl/get-proportion-of-plhiv-on-art-with-ae-by-type-of-suspected-causative-drugs.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from '../../entities/aggregate-adverse-events.model';

@QueryHandler(GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsQuery)
export class GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsHandler implements IQueryHandler<GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsQuery): Promise<any> {
        const proportionOfPlHIVByCausativeDrugs = this.repository
            .createQueryBuilder('f')
            .select([
                'AdverseEventCause adverseEventCause, SUM(AdverseEventsCount) count_cat',
            ])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.partner) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.facility) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await proportionOfPlHIVByCausativeDrugs
            .groupBy('f.AdverseEventCause')
            .orderBy('SUM(AdverseEventsCount)', 'DESC')
            .getRawMany();
    }
}
