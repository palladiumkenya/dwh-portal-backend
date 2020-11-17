import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransTreatmentOutcomes } from '../../entities/fact-trans-treatment-outcomes.model';
import { Repository } from 'typeorm';
import { GetTreatmentOutcomesByAgeQuery } from '../impl/get-treatment-outcomes-by-age.query';

@QueryHandler(GetTreatmentOutcomesByAgeQuery)
export class GetTreatmentOutcomesByAgeHandler implements IQueryHandler<GetTreatmentOutcomesByAgeQuery> {
    constructor(
        @InjectRepository(FactTransTreatmentOutcomes, 'mssql')
        private readonly repository: Repository<FactTransTreatmentOutcomes>
    ) {

    }

    async execute(query: GetTreatmentOutcomesByAgeQuery): Promise<any> {
        const treatmentOutcomes = this.repository.createQueryBuilder('f')
            .select(['ARTOutcome artOutcome, SUM(TotalOutcomes) totalOutcomes, ageGroup'])
            .where('f.MFLCode IS NOT NULL')
            .andWhere('f.artOutcome IS NOT NULL')
            .andWhere('f.ageGroup IS NOT NULL');

        if (query.county) {
            treatmentOutcomes.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            treatmentOutcomes.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            treatmentOutcomes.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            treatmentOutcomes.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await treatmentOutcomes
            .groupBy('f.ageGroup, f.ARTOutcome')
            .orderBy('f.ARTOutcome, f.ageGroup')
            .getRawMany();
    }
}
