import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransNewlyStarted } from '../../entities/fact-trans-newly-started.model';
import { Repository } from 'typeorm';
import { GetTxNewBySexQuery } from '../impl/get-tx-new-by-sex.query';

@QueryHandler(GetTxNewBySexQuery)
export class GetTxNewBySexHandler implements IQueryHandler<GetTxNewBySexQuery> {
    constructor(
        @InjectRepository(FactTransNewlyStarted, 'mssql')
        private readonly repository: Repository<FactTransNewlyStarted>
    ) {

    }

    async execute(query: GetTxNewBySexQuery): Promise<any> {
        const txNewBySex = this.repository.createQueryBuilder('f')
            .select(['[Gender], SUM([StartedART]) txNew'])
            .where('f.[StartedART] > 0')
            .andWhere('f.[Gender] IS NOT NULL');

        if (query.partner) {
            txNewBySex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }
        
        if (query.county) {
            txNewBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txNewBySex.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txNewBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if(query.month) {
            txNewBySex.andWhere('f.StartART_Month = :month', { month: query.month });
        }

        if (query.agency) {
            txNewBySex.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            txNewBySex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            txNewBySex.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if(query.year) {
            const yearVal = new Date().getFullYear();
            if(query.year == yearVal && !query.month) {
                txNewBySex.andWhere('f.Start_Year >= :startYear', { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
            } else {
                txNewBySex.andWhere('f.Start_Year = :startYear', { startYear: query.year });
            }
        }

        return await txNewBySex
            .groupBy('f.[Gender]')
            .orderBy('f.[Gender]')
            .getRawMany();
    }
}
