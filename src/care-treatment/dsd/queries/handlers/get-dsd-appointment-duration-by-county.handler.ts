import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdAppointmentDurationByCountyQuery } from '../impl/get-dsd-appointment-duration-by-county.query';
import {AggregateDSD} from "../../entities/aggregate-dsd.model";
import {AggregateDSDApptsByStability} from "../../entities/aggregate-dsd-appts-by-stability.model";

@QueryHandler(GetDsdAppointmentDurationByCountyQuery)
export class GetDsdAppointmentDurationByCountyHandler implements IQueryHandler<GetDsdAppointmentDurationByCountyQuery> {
    constructor(
        @InjectRepository(AggregateDSD, 'mssql')
        private readonly repository: Repository<AggregateDSD>
    ) {

    }

    async execute(query: GetDsdAppointmentDurationByCountyQuery): Promise<any> {
        let dsdAppointmentDuration = this.repository.createQueryBuilder('f')
            .select([' SUM(f.TxCurr) patients, f.AgeGroup ageGroup, SUM(df.patients_number) stablePatients, f.County county, (CAST(SUM(f.Stability) as float)/CAST(SUM(f.TxCurr) as float)) percentStable'])
            .innerJoin(AggregateDSDApptsByStability, 'df', 'df.MFLCode = f.MFLCode')
            .where('f.MFLCode > 1')
            .andWhere('CAST(f.StabilityAssessment AS NVARCHAR(10)) = :stability', { stability: "Stable"})

        if (query.county) {
            dsdAppointmentDuration = this.repository.createQueryBuilder('f')
                .select([' SUM(f.TxCurr) patients, f.AgeGroup ageGroup, SUM(df.patients_number) stablePatients, f.SubCounty county, (CAST(SUM(f.Stability) as float)/CAST(SUM(f.TxCurr) as float)) percentStable'])
                .innerJoin(AggregateDSDApptsByStability, 'df', 'df.MFLCode = f.MFLCode')
                .where('f.MFLCode > 1')
                .andWhere('CAST(f.Stability AS NVARCHAR(10)) = :stability', { stability: "Stable"})

            // .select(['SUM(TXCurr) patients, AgeGroup, SUM([NumPatients]) stablePatients, SubCounty county, (CAST(SUM([StabilityAssessment]) as float)/CAST(SUM(TXCurr) as float)) percentStable'])
            // .where('f.MFLCode > 1')
            // .andWhere('f.Stability = :stability', { stability: "Stable"});
            dsdAppointmentDuration.andWhere('f.County IN (:counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdAppointmentDuration.andWhere('f.SubCounty IN (:subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdAppointmentDuration.andWhere('f.FacilityName IN (:facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdAppointmentDuration.andWhere('f.PartnerName IN (:partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdAppointmentDuration.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.ageGroup) {
            dsdAppointmentDuration.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.ageGroup });
        }

        if (query.gender) {
            dsdAppointmentDuration.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.county) {
            return await dsdAppointmentDuration
                .groupBy('f.SubCounty, f.AgeGroup')
                .orderBy('percentStable', 'DESC')
                .getRawMany();
        } else {
            return await dsdAppointmentDuration
                .groupBy('f.County, f.AgeGroup')
                .orderBy('percentStable', 'DESC')
                .getRawMany();
        }
    }
}
