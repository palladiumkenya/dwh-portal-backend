import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransNewlyStarted } from '../../entities/fact-trans-newly-started.model';
import { Repository } from 'typeorm';
import { GetTxNewTrendsQuery } from '../impl/get-tx-new-trends.query';

@QueryHandler(GetTxNewTrendsQuery)
export class GetTxNewTrendsHandler implements IQueryHandler<GetTxNewTrendsQuery> {
    constructor(
        @InjectRepository(FactTransNewlyStarted, 'mssql')
        private readonly repository: Repository<FactTransNewlyStarted>
    ) {

    }

    async execute(query: GetTxNewTrendsQuery): Promise<any> {
        const txNew = this.repository.createQueryBuilder('f')
            .select(['[Start_Year] year, [StartART_Month] month, SUM([StartedART]) txNew, Gender gender'])
            .where('f.[StartedART] > 0');

        if (query.partner) {
            txNew.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.county) {
            txNew.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txNew.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txNew.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if(query.month) {
            txNew.andWhere('f.StartART_Month = :month', { month: query.month });
        }

        if (query.agency) {
            txNew.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            txNew.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if(query.year) {
            const yearVal = new Date().getFullYear();
            if(query.year == yearVal && !query.month) {
                txNew.andWhere('f.Start_Year >= :startYear', { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
            } else {
                txNew.andWhere('f.Start_Year = :startYear', { startYear: query.year });
            }
        }

        return await txNew
            .groupBy('f.[Start_Year], f.[StartART_Month], f.Gender')
            .orderBy('f.[Start_Year], f.[StartART_Month]')
            .getRawMany();
    }
}
