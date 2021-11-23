import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusByAgeSexQuery } from '../impl/get-dsd-stability-status-by-age-sex.query';
import { FactTransDsdAppointmentByStabilityStatus } from '../../entities/fact-trans-dsd-appointment-by-stability-status.model';

@QueryHandler(GetDsdStabilityStatusByAgeSexQuery)
export class GetDsdStabilityStatusByAgeSexHandler implements IQueryHandler<GetDsdStabilityStatusByAgeSexQuery> {
    constructor(
        @InjectRepository(FactTransDsdAppointmentByStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdAppointmentByStabilityStatus>
    ) {

    }

    async execute(query: GetDsdStabilityStatusByAgeSexQuery): Promise<any> {
        const dsdStabilityStatusByAgeSex = this.repository.createQueryBuilder('f')
            .select(['[DATIM_AgeGroup] ageGroup, SUM([NumPatients]) patients, SUM(TXCurr) TXCurr, Gender gender'])
            .where('f.MFLCode > 1')
            .andWhere('f.Stability = :stability', { stability: "Stable"})

        if (query.county) {
            dsdStabilityStatusByAgeSex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdStabilityStatusByAgeSex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdStabilityStatusByAgeSex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdStabilityStatusByAgeSex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdStabilityStatusByAgeSex.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await dsdStabilityStatusByAgeSex
            .groupBy('f.DATIM_AgeGroup, f.Gender')
            .orderBy('f.DATIM_AgeGroup, f.Gender')
            .getRawMany();
    }
}
