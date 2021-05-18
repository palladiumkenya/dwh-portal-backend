import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdAppointmentDurationByPartnerQuery } from '../impl/get-dsd-appointment-duration-by-partner.query';
import { FactTransDsdAppointmentByStabilityStatus } from '../../entities/fact-trans-dsd-appointment-by-stability-status.model';

@QueryHandler(GetDsdAppointmentDurationByPartnerQuery)
export class GetDsdAppointmentDurationByPartnerHandler implements IQueryHandler<GetDsdAppointmentDurationByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransDsdAppointmentByStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdAppointmentByStabilityStatus>
    ) {

    }

    async execute(query: GetDsdAppointmentDurationByPartnerQuery): Promise<any> {
        const dsdAppointmentDuration = this.repository.createQueryBuilder('f')
            .select(['SUM(TXCurr) patients, DATIM_AgeGroup ageGroup, SUM([StabilityAssessment]) stablePatients, CTPartner partner, (CAST(SUM([StabilityAssessment]) as float)/CAST(SUM(TXCurr) as float)) percentStable'])
            .where('f.MFLCode > 1')
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
            .groupBy('CTPartner, DATIM_AgeGroup')
            .orderBy('percentStable', 'DESC')
            .getRawMany();
    }
}
