import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivVaccinatedByCountyQuery } from '../impl/get-covid-adult-plhiv-vaccinated-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidAdultPlhivVaccinatedByCountyQuery)
export class GetCovidAdultPLHIVVaccinatedByCountyHandler implements IQueryHandler<GetCovidAdultPlhivVaccinatedByCountyQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidAdultPlhivVaccinatedByCountyQuery): Promise<any> {
        const adultPLHIVVaccinatedByCounty = this.repository.createQueryBuilder('f')
            .select(['VaccinationStatus, County, Count (*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('g.ageLV >= 18');

        if (query.county) {
            adultPLHIVVaccinatedByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await adultPLHIVVaccinatedByCounty
            .groupBy('County,VaccinationStatus')
            .getRawMany();
    }
}
