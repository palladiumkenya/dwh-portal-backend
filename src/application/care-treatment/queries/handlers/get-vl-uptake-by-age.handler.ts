import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../../../entities/care_treatment/fact-trans-vl-overall-uptake.model';
import { GetVlUptakeByAgeQuery } from '../get-vl-uptake-by-age.query';

@QueryHandler(GetVlUptakeByAgeQuery)
export class GetVlUptakeByAgeHandler implements IQueryHandler<GetVlUptakeByAgeQuery> {
    constructor(
        @InjectRepository(FactTransVLOverallUptake, 'mssql')
        private readonly repository: Repository<FactTransVLOverallUptake>
    ) {
    }

    async execute(query: GetVlUptakeByAgeQuery): Promise<any> {
        const vlUptakeByAge = this.repository.createQueryBuilder('f')
            .select(['f.AgeGroup ageGroup, f.Gender gender, SUM(f.VLDone) vlDone'])
            .where('f.MFLCode > 0')
            .andWhere('f.AgeGroup IS NOT NULL')
            .andWhere('f.Gender IS NOT NULL');

        if (query.county) {
            vlUptakeByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeByAge.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeByAge.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlUptakeByAge
            .groupBy('f.AgeGroup, f.Gender')
            .orderBy('f.AgeGroup, f.Gender')
            .getRawMany();
    }
}
