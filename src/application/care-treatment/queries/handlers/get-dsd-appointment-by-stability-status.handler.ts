import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdAppointmentByStabilityStatusQuery } from '../get-dsd-appointment-by-stability-status.query';
import { FactTransDsdAppointmentByStabilityStatus } from '../../../../entities/care_treatment/fact-trans-dsd-appointment-by-stability-status.model';

@QueryHandler(GetDsdAppointmentByStabilityStatusQuery)
export class GetDsdAppointmentByStabilityStatusHandler implements IQueryHandler<GetDsdAppointmentByStabilityStatusQuery> {
    constructor(
        @InjectRepository(FactTransDsdAppointmentByStabilityStatus, 'mssql')
        private readonly repository: Repository<FactTransDsdAppointmentByStabilityStatus>
    ) {

    }

    async execute(query: GetDsdAppointmentByStabilityStatusQuery): Promise<any> {
        const dsdCascade = this.repository.createQueryBuilder('f')
            .select(['SUM([NumPatients]) patients'])
            .where('f.[MFLCode] > 1');

        if (query.county) {
            dsdCascade.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdCascade.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdCascade.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdCascade.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await dsdCascade.getRawOne();
    }
}
