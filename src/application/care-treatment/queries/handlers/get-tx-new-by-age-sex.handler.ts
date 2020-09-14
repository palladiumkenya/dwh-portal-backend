import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransNewlyStarted } from '../../../../entities/care_treatment/fact-trans-newly-started.model';
import { Repository } from 'typeorm';
import { GetTxNewByAgeSexQuery } from '../get-tx-new-by-age-sex.query';

@QueryHandler(GetTxNewByAgeSexQuery)
export class GetTxNewByAgeSexHandler implements IQueryHandler<GetTxNewByAgeSexQuery> {
    constructor(
        @InjectRepository(FactTransNewlyStarted, 'mssql')
        private readonly repository: Repository<FactTransNewlyStarted>
    ) {

    }

    async execute(query: GetTxNewByAgeSexQuery): Promise<any> {
        const txNewByAgeSex = this.repository.createQueryBuilder('f')
            .select(['[AgeGroup], [Gender], SUM([StartedART]) txNew'])
            .where('f.[StartedART] > 0')
            .andWhere('f.[AgeGroup] IS NOT NULL')
            .andWhere('f.[Gender] IS NOT NULL');

        if (query.county) {
            txNewByAgeSex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txNewByAgeSex.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txNewByAgeSex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if(query.month) {
            txNewByAgeSex.andWhere('f.StartART_Month = :month', { month: query.month });
        }

        if(query.year) {
            const yearVal = new Date().getFullYear();
            if(query.year == yearVal && !query.month) {
                txNewByAgeSex.andWhere('f.Start_Year >= :startYear', { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
            } else {
                txNewByAgeSex.andWhere('f.Start_Year = :startYear', { startYear: query.year });
            }
        }

        return await txNewByAgeSex
            .groupBy('f.[AgeGroup], f.[Gender]')
            .orderBy('f.[AgeGroup], f.[Gender]')
            .getRawMany();
    }
}
