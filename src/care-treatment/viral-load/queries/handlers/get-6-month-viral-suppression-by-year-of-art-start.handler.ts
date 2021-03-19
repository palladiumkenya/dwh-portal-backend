import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Get6MonthViralSuppressionByYearOfArtStartQuery } from '../impl/get-6-month-viral-suppression-by-year-of-art-start.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransVlSuppressionArtStart } from '../../entities/fact-trans-vl-suppression-art-start.model';

@QueryHandler(Get6MonthViralSuppressionByYearOfArtStartQuery)
export class Get6MonthViralSuppressionByYearOfArtStartHandler implements IQueryHandler<Get6MonthViralSuppressionByYearOfArtStartQuery> {
    constructor(
        @InjectRepository(FactTransVlSuppressionArtStart, 'mssql')
        private readonly repository: Repository<FactTransVlSuppressionArtStart>
    ) {
    }

    async execute(query: Get6MonthViralSuppressionByYearOfArtStartQuery): Promise<any> {
        const sixMonthViralSupByYearOfArtStart = this.repository.createQueryBuilder('f')
            .select(['StartYear startYear, SUM(VLAt6Months_Sup) vlAt6Months_Sup, CASE WHEN SUM(VLAt6Months) = 0 THEN 0 ELSE (CAST(SUM(VLAt6Months_Sup) as float)/CAST(SUM(VLAt6Months) as float)) END percentAt6Months'])
            .where('f.MFLCode > 1')
            .andWhere('f.StartYear >= 2011');

        if (query.county) {
            sixMonthViralSupByYearOfArtStart.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            sixMonthViralSupByYearOfArtStart.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            sixMonthViralSupByYearOfArtStart.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            sixMonthViralSupByYearOfArtStart.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await sixMonthViralSupByYearOfArtStart
            .groupBy('f.StartYear')
            .orderBy('StartYear')
            .getRawMany();
    }
}
