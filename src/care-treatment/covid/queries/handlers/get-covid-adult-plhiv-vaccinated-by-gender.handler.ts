import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivVaccinatedByGenderQuery } from '../impl/get-covid-adult-plhiv-vaccinated-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidAdultPlhivVaccinatedByGenderQuery)
export class GetCovidAdultPLHIVVaccinatedByGenderHandler implements IQueryHandler<GetCovidAdultPlhivVaccinatedByGenderQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidAdultPlhivVaccinatedByGenderQuery): Promise<any> {
        const adultPLHIVVaccinatedByGender = this.repository.createQueryBuilder('f')
            .select(['VaccinationStatus, f.gender, Count (*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('g.ageLV >= 18 AND g.ARTOutcome = \'V\'');

        if (query.county) {
            adultPLHIVVaccinatedByGender.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByGender.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByGender.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByGender.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultPLHIVVaccinatedByGender.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            adultPLHIVVaccinatedByGender.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            adultPLHIVVaccinatedByGender.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await adultPLHIVVaccinatedByGender
            .groupBy('f.gender,VaccinationStatus')
            .getRawMany();
    }
}
