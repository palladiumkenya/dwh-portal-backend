import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../entities/fact-trans-vl-overall-uptake.model';
import { GetVlSuppressionByCountyQuery } from '../impl/get-vl-suppression-by-county.query';

@QueryHandler(GetVlSuppressionByCountyQuery)
export class GetVlSuppressionByCountyHandler implements IQueryHandler<GetVlSuppressionByCountyQuery> {
    constructor(
        @InjectRepository(FactTransVLOverallUptake, 'mssql')
        private readonly repository: Repository<FactTransVLOverallUptake>
    ) {
    }

    async execute(query: GetVlSuppressionByCountyQuery): Promise<any> {
        const vlSuppressionByCounty = this.repository.createQueryBuilder('f')
            .select(['f.County county, SUM(f.VirallySuppressed) suppressed'])
            .where('f.MFLCode > 0')
            .andWhere('f.County IS NOT NULL');

        if (query.county) {
            vlSuppressionByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionByCounty.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await vlSuppressionByCounty
            .groupBy('f.County')
            .orderBy('SUM(f.VirallySuppressed)', 'DESC')
            .getRawMany();
    }
}
