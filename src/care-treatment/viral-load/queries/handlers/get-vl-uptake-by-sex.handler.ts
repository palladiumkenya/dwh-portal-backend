import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../entities/fact-trans-vl-overall-uptake.model';
import { GetVlUptakeBySexQuery } from '../impl/get-vl-uptake-by-sex.query';

@QueryHandler(GetVlUptakeBySexQuery)
export class GetVlUptakeBySexHandler implements IQueryHandler<GetVlUptakeBySexQuery> {
    constructor(
        @InjectRepository(FactTransVLOverallUptake, 'mssql')
        private readonly repository: Repository<FactTransVLOverallUptake>
    ) {
    }

    async execute(query: GetVlUptakeBySexQuery): Promise<any> {
        const vlUptakeBySex = this.repository.createQueryBuilder('f')
            .select(['Gender gender, SUM(TXCurr) txCurr, SUM(EligibleVL12Mnths) eligible, SUM(VLDone) vlDone, SUM(VirallySuppressed) suppressed'])
            .where('f.MFLCode > 0')
            .andWhere('f.Gender IS NOT NULL');

        if (query.county) {
            vlUptakeBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeBySex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeBySex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlUptakeBySex
            .groupBy('f.Gender')
            .getRawMany();
    }
}
