import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrByAgeAndSexQuery } from '../impl/get-ct-tx-curr-by-age-and-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCtTxCurrByAgeAndSexQuery)
export class GetCtTxCurrByAgeAndSexHandler implements IQueryHandler<GetCtTxCurrByAgeAndSexQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtTxCurrByAgeAndSexQuery): Promise<any> {
        const txCurrByAgeAndSex = this.repository.createQueryBuilder('f')
            .select(['f.[ageGroup],[Gender],SUM([TXCURR_Total]) txCurr'])
            .innerJoin(DimAgeGroups, 'v', 'f.ageGroup = v.AgeGroup')
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

        if (query.partner) {
            txCurrByAgeAndSex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            txCurrByAgeAndSex.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            txCurrByAgeAndSex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            txCurrByAgeAndSex
                .andWhere('v.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        const result = await txCurrByAgeAndSex
            .groupBy('f.[ageGroup], [Gender]')
            .orderBy('f.[ageGroup]')
            .getRawMany();

        const returnedVal = [];
        const groupings = ['<1', '1-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65+'];
        for(let i = 0; i < groupings.length; i++) {
            for(let j = 0; j < result.length; j ++){
                if(result[j].ageGroup == groupings[i]) {
                    returnedVal.push(result[j]);
                }
            }
        }

        return  returnedVal;
    }
}
