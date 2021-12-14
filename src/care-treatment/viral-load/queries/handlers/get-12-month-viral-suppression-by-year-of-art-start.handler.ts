import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Get12MonthViralSuppressionByYearOfArtStartQuery } from '../impl/get-12-month-viral-suppression-by-year-of-art-start.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransVlSuppressionArtStart } from '../../entities/fact-trans-vl-suppression-art-start.model';
import { Repository } from 'typeorm';

@QueryHandler(Get12MonthViralSuppressionByYearOfArtStartQuery)
export class Get12MonthViralSuppressionByYearOfArtStartHandler implements IQueryHandler<Get12MonthViralSuppressionByYearOfArtStartQuery> {
    constructor(
        @InjectRepository(FactTransVlSuppressionArtStart, 'mssql')
        private readonly repository: Repository<FactTransVlSuppressionArtStart>
    ) {
    }

    async execute(query: Get12MonthViralSuppressionByYearOfArtStartQuery): Promise<any> {
        const twelveMonthViralSupByYearOfArtStart = this.repository.createQueryBuilder('f')
            .select(['StartYear startYear, SUM(VLAt12Months_Sup) vlAt12Months_Sup, CASE WHEN SUM(VLAt12Months) = 0 THEN 0 ELSE (CAST(SUM(VLAt12Months_Sup) as float)/CAST(SUM(VLAt12Months) as float)) END percentAt12Months'])
            .where('f.MFLCode > 1')
            .andWhere('f.StartYear >= 2011');

        if (query.county) {
            twelveMonthViralSupByYearOfArtStart.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            twelveMonthViralSupByYearOfArtStart.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            twelveMonthViralSupByYearOfArtStart.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            twelveMonthViralSupByYearOfArtStart.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            twelveMonthViralSupByYearOfArtStart.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            // lacking age group
            // sixMonthViralSupByYearOfArtStart.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            // lacking gender
            // sixMonthViralSupByYearOfArtStart.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await twelveMonthViralSupByYearOfArtStart
            .groupBy('f.StartYear')
            .orderBy('StartYear')
            .getRawMany();
    }
}
