import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivCurrentOnTreatmentByAgeGroupQuery } from '../impl/get-covid-adult-plhiv-current-on-treatment-by-age-group.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { Repository } from 'typeorm';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidAdultPlhivCurrentOnTreatmentByAgeGroupQuery)
export class GetCovidAdultPLHIVCurrentOnTreatmentByAgeGroupHandler implements IQueryHandler<GetCovidAdultPlhivCurrentOnTreatmentByAgeGroupQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetCovidAdultPlhivCurrentOnTreatmentByAgeGroupQuery): Promise<any> {
        const covidAdultsCurrentOnTreatmentByAgeGroup = this.repository.createQueryBuilder('f')
            .select(['Count (*) Adults, AgeGroup'])
            .innerJoin(DimAgeGroups, 'v', 'f.ageLV = v.Age')
            .where('f.ageLV >= 18 AND f.ARTOutcome=\'V\'');

        if (query.county) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidAdultsCurrentOnTreatmentByAgeGroup.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            // lacking age group
            // covidAdmissionByAge.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidAdultsCurrentOnTreatmentByAgeGroup
            .groupBy('AgeGroup')
            .getRawMany();
    }
}
