import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDsdAppointmentDurationCategorizationByStabilityStatusQuery } from '../impl/get-dsd-appointment-duration-categorization-by-stability-status.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdAppointmentByStabilityStatus } from '../../entities/fact-trans-dsd-appointment-by-stability-status.model';
import { Repository } from 'typeorm';
import {AggregateDSD} from "../../entities/aggregate-dsd.model";
import {AggregateDSDApptsByStability} from "../../entities/aggregate-dsd-appts-by-stability.model";

@QueryHandler(GetDsdAppointmentDurationCategorizationByStabilityStatusQuery)
export class GetDsdAppointmentDurationCategorizationByStabilityStatusHandler implements IQueryHandler<GetDsdAppointmentDurationCategorizationByStabilityStatusQuery> {
    constructor(
        @InjectRepository(AggregateDSDApptsByStability, 'mssql')
        private readonly repository: Repository<AggregateDSDApptsByStability>
    ) {
    }

    async execute(query: GetDsdAppointmentDurationCategorizationByStabilityStatusQuery): Promise<any> {
        const dsdAppointmentCategorization = this.repository
            .createQueryBuilder('f')
            .select([
                'SUM(patients_number) AS patients, AppointmentsCategory, StabilityAssessment Stability',
            ])
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
            dsdAppointmentCategorization.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdAppointmentCategorization.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.ageGroup) {
            dsdAppointmentCategorization.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.ageGroup });
        }

        if (query.gender) {
            dsdAppointmentCategorization.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdAppointmentCategorization
            .groupBy('[StabilityAssessment], [AppointmentsCategory]')
            .orderBy('AppointmentsCategory, StabilityAssessment', )
            .getRawMany();
    }
}
