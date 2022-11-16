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
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetCovidAdultPLHIVVaccinatedByAgeQuery): Promise<any> {
        const adultPLHIVVaccinatedByAge = this.repository.createQueryBuilder('f')
            .select(['f.VaccinationStatus, AgeGroup, Count (*) Num'])
            .leftJoin(FactTransCovidVaccines, 'g', 'f.PatientID = g.PatientID and g.SiteCode=f.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'f.ageLV = v.Age')
            .where('ageLV >= 12 AND ARTOutcome = \'V\'');

        if (query.county) {
            adultPLHIVVaccinatedByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByAge.andWhere('g.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByAge.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultPLHIVVaccinatedByAge.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            adultPLHIVVaccinatedByAge.andWhere('g.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            adultPLHIVVaccinatedByAge.andWhere(
                'AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await adultPLHIVVaccinatedByAge
            .groupBy('AgeGroup,f.VaccinationStatus')
            .getRawMany();
    }
}
