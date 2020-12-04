import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransTreatmentOutcomes } from '../../entities/fact-trans-treatment-outcomes.model';
import { Repository } from 'typeorm';
import { GetTreatmentOutcomesByFacilityQuery } from '../impl/get-treatment-outcomes-by-facility.query';

@QueryHandler(GetTreatmentOutcomesByFacilityQuery)
export class GetTreatmentOutcomesByFacilityHandler implements IQueryHandler<GetTreatmentOutcomesByFacilityQuery> {
    constructor(
        @InjectRepository(FactTransTreatmentOutcomes, 'mssql')
        private readonly repository: Repository<FactTransTreatmentOutcomes>
    ) {

    }

    async execute(query: GetTreatmentOutcomesByFacilityQuery): Promise<any> {
        const treatmentOutcomes = this.repository.createQueryBuilder('f')
            .select(['f.ARTOutcome artOutcome, SUM(f.TotalOutcomes) totalOutcomes, f.FacilityName facility'])
            .where('f.MFLCode IS NOT NULL')
            .andWhere('f.artOutcome IS NOT NULL')
            .andWhere('f.FacilityName IS NOT NULL');

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
            .groupBy('f.FacilityName, f.ARTOutcome')
            .orderBy('f.ARTOutcome, f.FacilityName')
            .getRawMany();
    }
}
