import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdAppointmentDurationByCountyQuery } from '../get-dsd-appointment-duration-by-county.query';
import { FactTransDsdAppointmentByStabilityStatus } from '../../../../entities/care_treatment/fact-trans-dsd-appointment-by-stability-status.model';

@QueryHandler(GetDsdAppointmentDurationByCountyQuery)
export class GetDsdAppointmentDurationByCountyHandler implements IQueryHandler<GetDsdAppointmentDurationByCountyQuery> {
    constructor(
        @InjectRepository(FactTransDsdAppointmentByStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdAppointmentByStabilityStatus>
    ) {

    }

    async execute(query: GetDsdAppointmentDurationByCountyQuery): Promise<any> {
        const dsdAppointmentDuration = this.repository.createQueryBuilder('f')
            .select(['SUM(NumPatients) patients, AppointmentsCategory, County county'])
            .where('f.MFLCode > 1')
            .andWhere('f.AppointmentsCategory IS NOT NULL')
            .andWhere('f.County IS NOT NULL')
            .andWhere('f.Stability = :stability', { stability: "Stable"});

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

        return await dsdAppointmentDuration
            .groupBy('County, AppointmentsCategory')
            .orderBy('AppointmentsCategory, County')
            .getRawMany();
    }
}
