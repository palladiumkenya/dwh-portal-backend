import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportedCausesOfAeQuery } from '../../adverse-events-queries/get-reported-causes-of-ae.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeCauses } from '../../../../../entities/care_treatment/fact-trans-ae-causes.model';
import { Repository } from 'typeorm';

@QueryHandler(GetReportedCausesOfAeQuery)
export class GetReportedCausesOfAeHandler implements IQueryHandler<GetReportedCausesOfAeQuery> {
    constructor(
        @InjectRepository(FactTransAeCauses, 'mssql')
        private readonly repository: Repository<FactTransAeCauses>
    ) {
    }

    async execute(query: GetReportedCausesOfAeQuery): Promise<any> {
        const reportedCausesOfAes = this.repository.createQueryBuilder('f')
            .select('[AdverseEventCause], SUM([AdverseEventActionTaken_Totals]) total')
            .where('[AdverseEventCause] IS NOT NULL');

        if (query.county) {
            reportedCausesOfAes
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            reportedCausesOfAes
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            reportedCausesOfAes
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            reportedCausesOfAes
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await reportedCausesOfAes
            .groupBy('AdverseEventCause')
            .getRawMany();
    }
}
