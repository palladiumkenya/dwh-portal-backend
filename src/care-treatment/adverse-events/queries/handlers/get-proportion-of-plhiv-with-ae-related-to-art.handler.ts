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
        const params = [];
        let proportionOfPlHIVWithAeRelatedToArt = 'SELECT \n' +
            '\n' +
            'AdverseEventCause, SUM(Num) count_cat\n' +
            '\n' +
            'FROM(SELECT  AdverseEventCause,\n' +
            'case when AdverseEventCause in (\'Anti TBS\', \'Isonaizid\') THEN \'Anti TBs\'\n' +
            'When AdverseEventCause in (\'Dolutegravir\',\'Atazanavir\',\'TLE\',\'Efavirenz\',\'Tenofavir\',\'Didanosin\',\'Lamivudine\',\'Lamivudine\',\'Lopinavir\',\'Abacavir\',\'TLD\',\'Nevirapine\',\'Zidovudine\',\'Stavudine\') THEN \'ARVS\'\n' +
            'When AdverseEventCause= \'More than one ARVs\' THEN \'More than one ARV\'\n' +
            ' when AdverseEventCause in (\'CTX\', \'Dapsone\') THEN \'Prophylaxis\'\n' +
            'else AdverseEventCause end as Type,\n' +
            'Num, MFLCode, FacilityName,County, SubCounty,CTPartner\n' +
            'FROM [PortalDev].[dbo].[Fact_Trans_AECausitiveDrugs]) A\n' +
            'WHERE A.Type = \'ARVS\'';

        if(query.subCounty) {
            proportionOfPlHIVWithAeRelatedToArt = `${proportionOfPlHIVWithAeRelatedToArt} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.county) {
            proportionOfPlHIVWithAeRelatedToArt = `${proportionOfPlHIVWithAeRelatedToArt} and County IN (?)`;
            params.push(query.county);
        }

        if(query.facility) {
            proportionOfPlHIVWithAeRelatedToArt = `${proportionOfPlHIVWithAeRelatedToArt} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            proportionOfPlHIVWithAeRelatedToArt = `${proportionOfPlHIVWithAeRelatedToArt} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        proportionOfPlHIVWithAeRelatedToArt = `${proportionOfPlHIVWithAeRelatedToArt} GROUP BY AdverseEventCause`;
        return  await this.repository.query(proportionOfPlHIVWithAeRelatedToArt, params);
    }
}
