import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidOverallMissedAppointmentsQuery } from '../impl/get-covid-overall-missed-appointments.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidOverallMissedAppointmentsQuery)
export class GetCovidOverallMissedAppointmentsHandler implements IQueryHandler<GetCovidOverallMissedAppointmentsQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidOverallMissedAppointmentsQuery): Promise<any> {
        const overallMissedAppointments = this.repository.createQueryBuilder('f')
            .select(['count(*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('MissedAppointmentDueToCOVID19=\'Yes\'');

        if (query.county) {
            overallMissedAppointments.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            overallMissedAppointments.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            overallMissedAppointments.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            overallMissedAppointments.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            overallMissedAppointments.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            overallMissedAppointments.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            overallMissedAppointments.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await overallMissedAppointments
            .groupBy('MissedAppointmentDueToCOVID19')
            .getRawOne();
    }
}
