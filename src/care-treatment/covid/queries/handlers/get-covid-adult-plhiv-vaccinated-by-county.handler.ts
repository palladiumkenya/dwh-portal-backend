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
            .where('g.ageLV >= 18 AND g.ARTOutcome = \'V\'');

        if (query.county) {
            adultPLHIVVaccinatedByCounty.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByCounty.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByCounty.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultPLHIVVaccinatedByCounty.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await adultPLHIVVaccinatedByCounty
            .groupBy('County,VaccinationStatus')
            .orderBy('Count(*)', 'DESC')
            .getRawMany();
    }
}
