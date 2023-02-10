import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfPLHIVWithAeRelatedToArtQuery } from '../impl/get-proportion-of-plhiv-with-ae-related-to-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeCausativeDrugs } from '../../entities/fact-trans-ae-causitive-drugs.model';
import { Repository } from 'typeorm';
import { AggregateAdverseEvents } from './../../entities/aggregate-adverse-events.model';

@QueryHandler(GetProportionOfPLHIVWithAeRelatedToArtQuery)
export class GetProportionOfPLHIVWithAeRelatedToArtHandler implements IQueryHandler<GetProportionOfPLHIVWithAeRelatedToArtQuery> {
    constructor(
        @InjectRepository(AggregateAdverseEvents, 'mssql')
        private readonly repository: Repository<AggregateAdverseEvents>
    ) {
    }

    async execute(query: GetProportionOfPLHIVWithAeRelatedToArtQuery): Promise<any> {
        const proportionOfPlHIVWithAeRelatedToArt = this.repository
            .createQueryBuilder('f')
            .select([
                'AdverseEventCause adverseEventCause, SUM(AdverseEventCount) count_cat',
            ])
            .andWhere(
                "AdverseEventCause IN ('Dolutegravir','Atazanavir','TLE','Efavirenz','Tenofavir','Didanosin','Lamivudine','Lamivudine','Lopinavir','Abacavir','TLD','Nevirapine','Zidovudine','Stavudine')",
            );

        if (query.county) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.partner) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.facility) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere(
                'f.Gender IN (:...genders)',
                { genders: query.gender },
            );
        }

        return await proportionOfPlHIVWithAeRelatedToArt
            .groupBy('f.AdverseEventCause')
            .orderBy('SUM(AdverseEventCount)', 'DESC')
            .getRawMany();
    }
}
