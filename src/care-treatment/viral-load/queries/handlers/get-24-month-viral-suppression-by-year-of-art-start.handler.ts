import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Get24MonthViralSuppressionByYearOfArtStartQuery } from '../impl/get-24-month-viral-suppression-by-year-of-art-start.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateVLUptakeOutcome } from '../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(Get24MonthViralSuppressionByYearOfArtStartQuery)
export class Get24MonthViralSuppressionByYearOfArtStartHandler implements IQueryHandler<Get24MonthViralSuppressionByYearOfArtStartQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: Get24MonthViralSuppressionByYearOfArtStartQuery): Promise<any> {
        const twentyFourMonthViralSupByYearOfArtStart = this.repository
            .createQueryBuilder('f')
            .select([
                'StartARTYear startYear, SUM(VLAt24Months) vlAt24Months_Sup, CASE WHEN SUM(VLAt24Months) = 0 THEN 0 ELSE (CAST(SUM(VLAt24Months_Sup) as float)/CAST(SUM(VLAt24Months) as float)) END percentAt24Months',
            ])
            .where('f.MFLCode > 1')
            .andWhere('f.StartARTYear >= 2011');

        if (query.county) {
            twentyFourMonthViralSupByYearOfArtStart.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            twentyFourMonthViralSupByYearOfArtStart.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            twentyFourMonthViralSupByYearOfArtStart.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            twentyFourMonthViralSupByYearOfArtStart.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            twentyFourMonthViralSupByYearOfArtStart.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            // lacking age group
            // sixMonthViralSupByYearOfArtStart.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            twentyFourMonthViralSupByYearOfArtStart.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await twentyFourMonthViralSupByYearOfArtStart
            .groupBy('f.StartARTYear')
            .orderBy('StartARTYear')
            .getRawMany();
    }
}
