import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsQuery } from '../impl/get-proportion-of-plhiv-on-art-with-ae-by-type-of-suspected-causative-drugs.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransAeCausativeDrugs } from '../../entities/fact-trans-ae-causitive-drugs.model';

@QueryHandler(GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsQuery)
export class GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsHandler implements IQueryHandler<GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsQuery> {
    constructor(
        @InjectRepository(FactTransAeCausativeDrugs, 'mssql')
        private readonly repository: Repository<FactTransAeCausativeDrugs>
    ) {
    }

    async execute(query: GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsQuery): Promise<any> {
        const proportionOfPlHIVByCausativeDrugs = this.repository.createQueryBuilder('f')
            .select(['AdverseEventCause adverseEventCause, SUM(Num) count_cat'])
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.partner) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.facility) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.agency) {
            proportionOfPlHIVByCausativeDrugs.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await proportionOfPlHIVByCausativeDrugs
            .groupBy('f.AdverseEventCause')
            .orderBy('SUM(Num)', 'DESC')
            .getRawMany();
    }
}
