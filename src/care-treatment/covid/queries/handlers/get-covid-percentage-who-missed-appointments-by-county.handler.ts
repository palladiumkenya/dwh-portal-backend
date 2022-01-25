import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidPercentageWhoMissedAppointmentsByCountyQuery } from '../impl/get-covid-percentage-who-missed-appointments-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidPercentageWhoMissedAppointmentsByCountyQuery)
export class GetCovidPercentageWhoMissedAppointmentsByCountyHandler implements IQueryHandler<GetCovidPercentageWhoMissedAppointmentsByCountyQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidPercentageWhoMissedAppointmentsByCountyQuery): Promise<any> {
        const covidPercentageWhoMissedAppointmentsByCounty = this.repository.createQueryBuilder('f')
            .select(['County, count (*)Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode = g.MFLCode and f.PatientPK = g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('MissedAppointmentDueToCOVID19=\'Yes\' AND County IS NOT NULL');

        if (query.county) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidPercentageWhoMissedAppointmentsByCounty.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidPercentageWhoMissedAppointmentsByCounty
            .groupBy('County')
            .getRawMany();
    }
}
