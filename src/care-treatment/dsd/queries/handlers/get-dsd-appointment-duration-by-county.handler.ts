import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdAppointmentDurationByCountyQuery } from '../impl/get-dsd-appointment-duration-by-county.query';
import { FactTransDsdAppointmentByStabilityStatus } from '../../entities/fact-trans-dsd-appointment-by-stability-status.model';

@QueryHandler(GetDsdAppointmentDurationByCountyQuery)
export class GetDsdAppointmentDurationByCountyHandler implements IQueryHandler<GetDsdAppointmentDurationByCountyQuery> {
    constructor(
        @InjectRepository(FactTransDsdAppointmentByStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdAppointmentByStabilityStatus>
    ) {

    }

    async execute(query: GetDsdAppointmentDurationByCountyQuery): Promise<any> {
        let dsdAppointmentDuration = this.repository.createQueryBuilder('f')
            .select(['SUM(TXCurr) patients, DATIM_AgeGroup, SUM([StabilityAssessment]) stablePatients, County county, (CAST(SUM([StabilityAssessment]) as float)/CAST(SUM(TXCurr) as float)) percentStable'])
            .where('f.MFLCode > 1')
            .andWhere('f.Stability = :stability', { stability: "Stable"});

        if (query.county) {
            dsdAppointmentDuration = this.repository.createQueryBuilder('f')
                .select(['SUM(TXCurr) patients, DATIM_AgeGroup, SUM([StabilityAssessment]) stablePatients, SubCounty county, (CAST(SUM([StabilityAssessment]) as float)/CAST(SUM(TXCurr) as float)) percentStable'])
                .where('f.MFLCode > 1')
                .andWhere('f.Stability = :stability', { stability: "Stable"});
            dsdAppointmentDuration.andWhere('f.County IN (:counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdAppointmentDuration.andWhere('f.SubCounty IN (:subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdAppointmentDuration.andWhere('f.FacilityName IN (:facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdAppointmentDuration.andWhere('f.CTPartner IN (:partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdAppointmentDuration.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.county) {
            return await dsdAppointmentDuration
                .groupBy('SubCounty, DATIM_AgeGroup')
                .orderBy('percentStable', 'DESC')
                .getRawMany();
        } else {
            return await dsdAppointmentDuration
                .groupBy('County, DATIM_AgeGroup')
                .orderBy('percentStable', 'DESC')
                .getRawMany();
        }
    }
}
