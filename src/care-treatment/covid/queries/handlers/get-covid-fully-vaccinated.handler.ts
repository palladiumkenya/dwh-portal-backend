import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidFullyVaccinatedQuery } from '../impl/get-covid-fully-vaccinated.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';

@QueryHandler(GetCovidFullyVaccinatedQuery)
export class GetCovidFullyVaccinatedHandler implements IQueryHandler<GetCovidFullyVaccinatedQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidFullyVaccinatedQuery): Promise<any> {
        const covidFullyVaccinated = this.repository.createQueryBuilder('f')
            .select(['Count (f.PatientID) FullyVaccinated'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .where('g.ageLV >= 18 AND f.VaccinationStatus=\'Fully Vaccinated\' ');

        if (query.county) {
            covidFullyVaccinated.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidFullyVaccinated.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidFullyVaccinated.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidFullyVaccinated.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await covidFullyVaccinated.getRawOne();
    }
}
