import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDsdAppointmentDurationCategorizationByStabilityStatusQuery } from '../impl/get-dsd-appointment-duration-categorization-by-stability-status.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdAppointmentByStabilityStatus } from '../../entities/fact-trans-dsd-appointment-by-stability-status.model';
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
            .select(['SUM(NUMPatients) AS patients, AppointmentsCategory, Stability, CAST((cast(SUM(NUMPatients) as decimal (9,2))/ (SUM(SUM(NUMPatients)) OVER (PARTITION BY Stability ORDER BY Stability))*100) as decimal(8,2))  AS proportionByStability'])
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

        if (query.agency) {
            dsdAppointmentCategorization.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            dsdAppointmentCategorization.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            dsdAppointmentCategorization.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdAppointmentCategorization
            .groupBy('[Stability], [AppointmentsCategory]')
            .orderBy('AppointmentsCategory, Stability')
            .getRawMany();
    }
}
