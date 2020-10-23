import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOutcome } from 'src/entities/care_treatment/fact-trans-vl-outcome.model';
import { GetVlSuppressionByRegimenQuery } from '../get-vl-suppression-by-regimen.query';

@QueryHandler(GetVlSuppressionByRegimenQuery)
export class GetVlSuppressionByRegimenHandler implements IQueryHandler<GetVlSuppressionByRegimenQuery> {
    constructor(
        @InjectRepository(FactTransVLOutcome, 'mssql')
        private readonly repository: Repository<FactTransVLOutcome>
    ) {
    }

    async execute(query: GetVlSuppressionByRegimenQuery): Promise<any> {
        const vlSuppressionByRegimen = this.repository.createQueryBuilder('f')
            .select(['f.CurrentRegimen regimen, f.Last12MVLResult suppression, SUM(f.Total_Last12MVL) vlDone'])
            .where('f.MFLCode > 0')
            .andWhere('f.CurrentRegimen IS NOT NULL')
            .andWhere('f.Last12MVLResult IS NOT NULL');

        if (query.county) {
            vlSuppressionByRegimen.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionByRegimen.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionByRegimen.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionByRegimen.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlSuppressionByRegimen
            .groupBy('f.CurrentRegimen, f.Last12MVLResult')
            .orderBy('f.CurrentRegimen, f.Last12MVLResult')
            .getRawMany();
    }
}
