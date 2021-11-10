import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcOverallOvcServQuery } from '../impl/get-ovc-overall-ovc-serv.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';
import { Repository } from 'typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';

@QueryHandler(GetOvcOverallOvcServQuery)
export class GetOvcOverallOvcServHandler implements IQueryHandler<GetOvcOverallOvcServQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcOverallOvcServQuery): Promise<any> {
        const overOvcServ = this.repository.createQueryBuilder('f')
            .select(['COUNT(*) overallOvcServ'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL');

        if (query.county) {
            overOvcServ.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            overOvcServ.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            overOvcServ.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            overOvcServ.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            overOvcServ.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await overOvcServ.getRawOne();
    }
}
