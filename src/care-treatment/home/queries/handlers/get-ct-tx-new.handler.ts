import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxNewQuery } from '../impl/get-ct-tx-new.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransNewlyStarted } from '../../entities/fact-trans-newly-started.model';

@QueryHandler(GetCtTxNewQuery)
export class GetCtTxNewHandler implements IQueryHandler<GetCtTxNewQuery> {
    constructor(
        @InjectRepository(FactTransNewlyStarted, 'mssql')
        private readonly repository: Repository<FactTransNewlyStarted>
    ) {
    }

    async execute(query: GetCtTxNewQuery): Promise<any> {
        const txNew = this.repository.createQueryBuilder('f')
            .select(['[Sex] Gender, [Start_Year] year, [StartART_Month] month, SUM([StartedART]) tx_new'])
            .where('f.[StartedART] > 0');

        if (query.county) {
            txNew
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txNew
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txNew
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            txNew
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if(query.month) {
            txNew.andWhere('f.StartART_Month = :month', { month: query.month });
        }

        if(query.year) {
            const dateVal = new Date();
            const yearVal = dateVal.getFullYear();

            if(query.year == yearVal) {
                txNew.andWhere('f.Start_Year >= :startYear', { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
            } else {
                txNew.andWhere('f.Start_Year = :startYear', { startYear: query.year });
            }
        }

        return await txNew
            .groupBy('f.[Sex], f.[Start_Year], f.[StartART_Month]')
            .orderBy('f.[Start_Year], f.[StartART_Month]')
            .getRawMany();
    }
}
