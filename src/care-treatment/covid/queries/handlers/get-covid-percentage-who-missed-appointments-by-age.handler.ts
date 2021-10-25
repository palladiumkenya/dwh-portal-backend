import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidPercentageWhoMissedAppointmentsByAgeQuery } from '../impl/get-covid-percentage-who-missed-appointments-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidPercentageWhoMissedAppointmentsByAgeQuery)
export class GetCovidPercentageWhoMissedAppointmentsByAgeHandler implements IQueryHandler<GetCovidPercentageWhoMissedAppointmentsByAgeQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidPercentageWhoMissedAppointmentsByAgeQuery): Promise<any> {
        const covidPercentageWhoMissedAppointmentsByAge = this.repository.createQueryBuilder('f')
            .select(['Agegroup,count (*)Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode = g.MFLCode and f.PatientPK = g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('MissedAppointmentDueToCOVID19=\'Yes\'');

        if (query.county) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidPercentageWhoMissedAppointmentsByAge.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await covidPercentageWhoMissedAppointmentsByAge
            .groupBy('AgeGroup')
            .getRawMany();
    }
}
