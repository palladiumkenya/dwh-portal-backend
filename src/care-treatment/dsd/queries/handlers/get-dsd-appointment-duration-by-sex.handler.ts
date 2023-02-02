import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdAppointmentDurationBySexQuery } from '../impl/get-dsd-appointment-duration-by-sex.query';
import { FactTransDsdAppointmentByStabilityStatus } from '../../entities/fact-trans-dsd-appointment-by-stability-status.model';
import {AggregateDSD} from "../../entities/aggregate-dsd.model";
import {AggregateDSDApptsByStability} from "../../entities/aggregate-dsd-appts-by-stability.model";

@QueryHandler(GetDsdAppointmentDurationBySexQuery)
export class GetDsdAppointmentDurationBySexHandler implements IQueryHandler<GetDsdAppointmentDurationBySexQuery> {
    constructor(
        @InjectRepository(AggregateDSDApptsByStability, 'mssql')
        private readonly repository: Repository<AggregateDSDApptsByStability>
    ) {

    }

    async execute(query: GetDsdAppointmentDurationBySexQuery): Promise<any> {
        const dsdAppointmentDuration = this.repository.createQueryBuilder('f')
            .select(['SUM(patients_number) patients, AppointmentsCategory, Gender'])
            .where('f.MFLCode > 1')
            .andWhere('f.AppointmentsCategory IS NOT NULL')
            .andWhere('f.Gender IS NOT NULL');

        if (query.county) {
            dsdAppointmentDuration.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdAppointmentDuration.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdAppointmentDuration.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdAppointmentDuration.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdAppointmentDuration.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.ageGroup) {
            dsdAppointmentDuration.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.ageGroup });
        }

        if (query.gender) {
            dsdAppointmentDuration.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdAppointmentDuration
            .groupBy('Gender, AppointmentsCategory')
            .orderBy('AppointmentsCategory, Gender')
            .getRawMany();
    }
}
