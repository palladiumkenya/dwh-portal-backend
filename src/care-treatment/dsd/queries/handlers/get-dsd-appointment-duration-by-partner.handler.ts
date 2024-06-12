import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdAppointmentDurationByPartnerQuery } from '../impl/get-dsd-appointment-duration-by-partner.query';
import { FactTransDsdAppointmentByStabilityStatus } from '../../entities/fact-trans-dsd-appointment-by-stability-status.model';
import {AggregateDSD} from "../../entities/aggregate-dsd.model";
import {AggregateDSDApptsByStability} from "../../entities/aggregate-dsd-appts-by-stability.model";

@QueryHandler(GetDsdAppointmentDurationByPartnerQuery)
export class GetDsdAppointmentDurationByPartnerHandler implements IQueryHandler<GetDsdAppointmentDurationByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateDSD, 'mssql')
        private readonly repository: Repository<AggregateDSD>
    ) {

    }

    async execute(query: GetDsdAppointmentDurationByPartnerQuery): Promise<any> {
        const dsdAppointmentDuration = this.repository.createQueryBuilder('f')
            .select([' SUM(f.TxCurr) patients, f.AgeGroup ageGroup, SUM(df.patients_number) stablePatients, f.PartnerName partner, (CAST(SUM(f.Stability) as float)/CAST(SUM(f.TxCurr) as float)) percentStable'])
            .innerJoin(AggregateDSDApptsByStability, 'df', 'df.MFLCode = f.MFLCode')
            .where('f.MFLCode > 1')
            .andWhere('CAST(f.StabilityAssessment AS NVARCHAR(10)) = :stability', { stability: "Stable"})
            
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
            dsdAppointmentDuration.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdAppointmentDuration.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.ageGroup) {
            dsdAppointmentDuration.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.ageGroup });
        }

        if (query.gender) {
            dsdAppointmentDuration.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdAppointmentDuration
            .groupBy('f.PartnerName, f.AgeGroup')
            .orderBy('percentStable', 'DESC')
            .getRawMany();
    }
}
