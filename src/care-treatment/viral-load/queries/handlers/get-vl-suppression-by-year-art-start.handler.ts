import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOutcome } from '../../entities/fact-trans-vl-outcome.model';
import { GetVlSuppressionByYearArtStartQuery } from '../impl/get-vl-suppression-by-year-art-start.query';

@QueryHandler(GetVlSuppressionByYearArtStartQuery)
export class GetVlSuppressionByYearArtStartHandler implements IQueryHandler<GetVlSuppressionByYearArtStartQuery> {
    constructor(
        @InjectRepository(FactTransVLOutcome, 'mssql')
        private readonly repository: Repository<FactTransVLOutcome>
    ) {
    }

    async execute(query: GetVlSuppressionByYearArtStartQuery): Promise<any> {
        const vlSuppressionByYearArtStart = this.repository.createQueryBuilder('f')
            .select(['f.StartART_Year year, SUM(f.Total_Last12MVL) vlDone'])
            .where('f.MFLCode > 0')
            .andWhere('f.Last12MVLResult = :suppression', { suppression: "SUPPRESSED" })
            .andWhere('f.StartART_Year >= :year', { year: 2011 });

        if (query.county) {
            vlSuppressionByYearArtStart.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionByYearArtStart.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionByYearArtStart.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionByYearArtStart.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionByYearArtStart.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await vlSuppressionByYearArtStart
            .groupBy('f.StartART_Year')
            .orderBy('f.StartART_Year')
            .getRawMany();
    }
}
