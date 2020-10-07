import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDsdAppointmentDurationCategorizationByStabilityStatusQuery } from '../get-dsd-appointment-duration-categorization-by-stability-status.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdAppointmentByStabilityStatus } from '../../../../entities/care_treatment/fact-trans-dsd-appointment-by-stability-status.model';
import { Repository } from 'typeorm';

@QueryHandler(GetDsdAppointmentDurationCategorizationByStabilityStatusQuery)
export class GetDsdAppointmentDurationCategorizationByStabilityStatusHandler implements IQueryHandler<GetDsdAppointmentDurationCategorizationByStabilityStatusQuery> {
    constructor(
        @InjectRepository(FactTransDsdAppointmentByStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdAppointmentByStabilityStatus>
    ) {
    }

    async execute(query: GetDsdAppointmentDurationCategorizationByStabilityStatusQuery): Promise<any> {
        const dsdAppointmentCategorization = this.repository.createQueryBuilder('f')
            .select(['SUM([NumPatients]) patients, AppointmentsCategory, Stability'])
            .where('f.[AppointmentsCategory] IS NOT NULL');

        if (query.county) {
            dsdAppointmentCategorization.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdAppointmentCategorization.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdAppointmentCategorization.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdAppointmentCategorization.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await dsdAppointmentCategorization
            .groupBy('[Stability], [AppointmentsCategory]')
            .orderBy('AppointmentsCategory, Stability')
            .getRawMany();
    }
}
