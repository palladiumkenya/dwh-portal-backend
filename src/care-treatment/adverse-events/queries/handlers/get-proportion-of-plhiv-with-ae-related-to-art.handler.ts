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
            .select(['advEvntCause adverseEventCause, SUM(catNum) count_cat'])
            .from(subQuery => {
                return subQuery
                    .select("AdverseEventCause as advEvntCause,\n" +
                        "case when AdverseEventCause in ('Anti TBS', 'Isonaizid') THEN 'Anti TBs'\n" +
                        "When AdverseEventCause in ('Dolutegravir','Atazanavir','TLE','Efavirenz','Tenofavir','Didanosin','Lamivudine','Lamivudine','Lopinavir','Abacavir','TLD','Nevirapine','Zidovudine','Stavudine') THEN 'ARVS'\n" +
                        "When AdverseEventCause= 'More than one ARVs' THEN 'More than one ARV'\n" +
                        " when AdverseEventCause in ('CTX', 'Dapsone') THEN 'Prophylaxis'\n" +
                        "else AdverseEventCause end as Type,\n" +
                        "Num as catNum, MFLCode as MFLCode, FacilityName as FacilityName,County as County, SubCounty as SubCounty")
                    .from(FactTransAeCausativeDrugs, "Fact_Trans_AECausitiveDrugs")
            }, "FactTransAeCausativeDrugs")
            .andWhere('Type = :Type', { Type: "ARVS"});

        if (query.county) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.partner) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.facility) {
            proportionOfPlHIVWithAeRelatedToArt.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        return await proportionOfPlHIVWithAeRelatedToArt
            .groupBy('advEvntCause')
            .orderBy('SUM(catNum)', 'DESC')
            .getRawMany();
    }
}
