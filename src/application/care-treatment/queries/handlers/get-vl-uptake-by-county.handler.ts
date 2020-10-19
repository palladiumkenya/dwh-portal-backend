import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../../../entities/care_treatment/fact-trans-vl-overall-uptake.model';
import { GetVlUptakeByCountyQuery } from '../get-vl-uptake-by-county.query';

@QueryHandler(GetVlUptakeByCountyQuery)
export class GetVlUptakeByCountyHandler implements IQueryHandler<GetVlUptakeByCountyQuery> {
    constructor(
        @InjectRepository(FactTransVLOverallUptake, 'mssql')
        private readonly repository: Repository<FactTransVLOverallUptake>
    ) {
    }

    async execute(query: GetVlUptakeByCountyQuery): Promise<any> {
        const vlUptakeByCounty = this.repository.createQueryBuilder('f')
            .select(['f.County county, SUM(f.VLDone) vlDone'])
            .where('f.MFLCode > 0')
            .andWhere('f.County IS NOT NULL');

        if (query.county) {
            vlUptakeByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlUptakeByCounty
            .groupBy('f.County')
            .orderBy('SUM(f.VLDone)')
            .getRawMany();
    }
}
