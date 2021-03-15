import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAeActionsByDrugsNewQuery } from '../impl/get-ae-actions-by-drugs-new.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransAeActionDrug } from '../../entities/fact-trans-ae-action-drug.model';
import { Repository } from 'typeorm';

@QueryHandler(GetAeActionsByDrugsNewQuery)
export class GetAeActionsByDrugsNewHandler implements IQueryHandler<GetAeActionsByDrugsNewQuery> {
    constructor(
        @InjectRepository(FactTransAeActionDrug, 'mssql')
        private readonly repository: Repository<FactTransAeActionDrug>
    ) {
    }

    async execute(query: GetAeActionsByDrugsNewQuery): Promise<any> {
        const aeActionsByDrugsNew = this.repository.createQueryBuilder('f')
            .select('[AdverseEventCause], [AdverseEventActionTaken], SUM([AdverseEventCause_Total]) total')
            .where('[MFLCode] > 0')
            .andWhere('[AdverseEventCause] IS NOT NULL')
            .andWhere('[AdverseEventActionTaken] IS NOT NULL');

        if (query.county) {
            aeActionsByDrugsNew
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            aeActionsByDrugsNew
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            aeActionsByDrugsNew
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            aeActionsByDrugsNew
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await aeActionsByDrugsNew
            .groupBy('[AdverseEventCause], [AdverseEventActionTaken]')
            .orderBy('[AdverseEventCause], [AdverseEventActionTaken]')
            .getRawMany();
    }
}
