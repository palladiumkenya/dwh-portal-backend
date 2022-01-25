import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPLHIVVaccinatedByAgeQuery } from '../impl/get-covid-adult-plhiv-vaccinated-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidAdultPLHIVVaccinatedByAgeQuery)
export class GetCovidAdultPLHIVVaccinatedByAgeHandler implements IQueryHandler<GetCovidAdultPLHIVVaccinatedByAgeQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidAdultPLHIVVaccinatedByAgeQuery): Promise<any> {
        const adultPLHIVVaccinatedByAge = this.repository.createQueryBuilder('f')
            .select(['VaccinationStatus, AgeGroup, Count (*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('g.ageLV >= 18 AND g.ARTOutcome = \'V\'');

        if (query.county) {
            adultPLHIVVaccinatedByAge.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByAge.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByAge.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByAge.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultPLHIVVaccinatedByAge.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            adultPLHIVVaccinatedByAge.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            adultPLHIVVaccinatedByAge.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await adultPLHIVVaccinatedByAge
            .groupBy('AgeGroup,VaccinationStatus')
            .getRawMany();
    }
}
