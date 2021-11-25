import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNewlyStartedDesegregatedQuery } from '../impl/get-newly-started-desegregated.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransNewlyStarted } from '../../entities/fact-trans-newly-started.model';

@QueryHandler(GetNewlyStartedDesegregatedQuery)
export class GetNewlyStartedDesegregatedHandler implements IQueryHandler<GetNewlyStartedDesegregatedQuery> {
    constructor(
        @InjectRepository(FactTransNewlyStarted, 'mssql')
        private readonly repository: Repository<FactTransNewlyStarted>
    ) {
    }

    async execute(query: GetNewlyStartedDesegregatedQuery): Promise<any> {
        const newlyStartedDesegregated = this.repository.createQueryBuilder('f')
            .select('SUM([StartedART]) TotalStartedOnART,\n' +
                'SUM(CASE When Gender=\'Male\' Then [StartedART] Else 0 End ) as MalesStartedOnART,\n' +
                'SUM(CASE When Gender=\'Female\' Then [StartedART] Else 0 End ) as FemalesStartedOnART,\n' +
                'SUM(CASE When AgeGroup IN(\'15 to 19\', \'20 to 24\', \'25 to 29\', \'30 to 34\', \'35 to 39\', \'40 to 44\', \'45 to 49\', \'50 to 54\', \'55 to 59\', \'60 to 64\', \'65+\') Then [StartedART] Else 0 End ) as AdultsStartedOnART,\n' +
                'SUM(CASE When AgeGroup IN(\'10 to 14\', \'15 to 19\') Then [StartedART] Else 0 End ) as AdolescentsStartedOnART,\n' +
                'SUM(CASE When AgeGroup IN(\'Under 1\', \'1 to 4\', \'5 to 9\', \'10 to 14\') Then [StartedART] Else 0 End ) as ChildrenStartedOnART')
            .where('StartedART IS NOT NULL');

        if (query.county) {
            newlyStartedDesegregated
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            newlyStartedDesegregated
                .andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            newlyStartedDesegregated
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            newlyStartedDesegregated
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.year) {
            newlyStartedDesegregated.andWhere('f.Start_Year = (:year)', { year: query.year })
        }

        if (query.month) {
            newlyStartedDesegregated.andWhere('f.StartART_Month = :month', { month: query.month });
        }

        if (query.agency) {
            newlyStartedDesegregated.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            newlyStartedDesegregated.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await newlyStartedDesegregated
            .getRawOne();
    }
}
