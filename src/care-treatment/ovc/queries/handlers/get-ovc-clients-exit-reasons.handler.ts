import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcClientsExitReasonsQuery } from '../impl/get-ovc-clients-exit-reasons.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from '../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcClientsExitReasonsQuery)
export class GetOvcClientsExitReasonsHandler implements IQueryHandler<GetOvcClientsExitReasonsQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcClientsExitReasonsQuery): Promise<any> {
        const overOvcServByCounty = this.repository.createQueryBuilder('f')
            .select(['CASE WHEN [OVCExitReason] IS NULL THEN \'Undocumented\' ELSE OVCExitReason END AS OVCExitReason, COUNT(*) count, COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS Percentage'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL');

        if (query.county) {
            overOvcServByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            overOvcServByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            overOvcServByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            overOvcServByCounty.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            overOvcServByCounty.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            overOvcServByCounty.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        return await overOvcServByCounty
            .groupBy('[OVCExitReason]')
            .getRawMany();
    }
}
