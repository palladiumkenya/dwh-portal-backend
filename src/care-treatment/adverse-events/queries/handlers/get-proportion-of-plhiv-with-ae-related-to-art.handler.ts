import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfPLHIVWithAeRelatedToArtQuery } from '../impl/get-proportion-of-plhiv-with-ae-related-to-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeCausativeDrugs } from '../../entities/fact-trans-ae-causitive-drugs.model';
import { Repository } from 'typeorm';

@QueryHandler(GetProportionOfPLHIVWithAeRelatedToArtQuery)
export class GetProportionOfPLHIVWithAeRelatedToArtHandler implements IQueryHandler<GetProportionOfPLHIVWithAeRelatedToArtQuery> {
    constructor(
        @InjectRepository(FactTransAeCausativeDrugs, 'mssql')
        private readonly repository: Repository<FactTransAeCausativeDrugs>
    ) {
    }

    async execute(query: GetProportionOfPLHIVWithAeRelatedToArtQuery): Promise<any> {
        const proportionOfPlHIVWithAeRelatedToArt = this.repository.createQueryBuilder('f')
            .select(['AdverseEventCause adverseEventCause, SUM(Num) count_cat'])
            .andWhere('AdverseEventCause IN (\'Dolutegravir\',\'Atazanavir\',\'TLE\',\'Efavirenz\',\'Tenofavir\',\'Didanosin\',\'Lamivudine\',\'Lamivudine\',\'Lopinavir\',\'Abacavir\',\'TLD\',\'Nevirapine\',\'Zidovudine\',\'Stavudine\')');

        if (query.county) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.partner) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.facility) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            // lacking gender
            // proportionOfPlHIVWithAeRelatedToArt.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await proportionOfPlHIVWithAeRelatedToArt
            .groupBy('f.AdverseEventCause')
            .orderBy('SUM(Num)', 'DESC')
            .getRawMany();
    }
}
