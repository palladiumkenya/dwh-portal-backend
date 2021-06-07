import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcServBySexQuery } from '../impl/get-ovc-serv-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcServBySexQuery)
export class GetOvcServBySexHandler implements IQueryHandler<GetOvcServBySexQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcServBySexQuery): Promise<any> {
        const ovcServBySex = this.repository.createQueryBuilder('f')
            .select(['COUNT(*) overallOvcServ, Gender'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL');

        if (query.county) {
            ovcServBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            ovcServBySex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            ovcServBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            ovcServBySex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await ovcServBySex
            .groupBy('Gender')
            .getRawMany();
    }
}