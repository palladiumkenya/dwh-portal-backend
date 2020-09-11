import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrByAgeAndSexQuery } from '../get-ct-tx-curr-by-age-and-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtTxCurrByAgeAndSexQuery)
export class GetCtTxCurrByAgeAndSexHandler implements IQueryHandler<GetCtTxCurrByAgeAndSexQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtTxCurrByAgeAndSexQuery): Promise<any> {
        const txCurrByAgeAndSex = this.repository.createQueryBuilder('f')
            .select(['[ageGroup],[Gender],SUM([TXCURR_Total]) txCurr'])
            .where('f.[ageGroup] IS NOT NULL');

        if (query.county) {
            txCurrByAgeAndSex
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txCurrByAgeAndSex
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txCurrByAgeAndSex
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        return await txCurrByAgeAndSex
            .groupBy('[ageGroup], [Gender]')
            .orderBy('[ageGroup]')
            .getRawMany();
    }
}
