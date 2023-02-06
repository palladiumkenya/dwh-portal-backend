import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidOverallMissedAppointmentsQuery } from '../impl/get-covid-overall-missed-appointments.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidOverallMissedAppointmentsQuery)
export class GetCovidOverallMissedAppointmentsHandler implements IQueryHandler<GetCovidOverallMissedAppointmentsQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidOverallMissedAppointmentsQuery): Promise<any> {
        const overallMissedAppointments = this.repository.createQueryBuilder('f')
            .select(['count(*) Num'])
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
            overallMissedAppointments.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            overallMissedAppointments.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            overallMissedAppointments.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await overallMissedAppointments
            .groupBy('MissedAppointmentDueToCOVID19')
            .getRawOne();
    }
}
