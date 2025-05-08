import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Get6MonthViralSuppressionByYearOfArtStartQuery } from '../impl/get-6-month-viral-suppression-by-year-of-art-start.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateVLUptakeOutcome } from '../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(Get6MonthViralSuppressionByYearOfArtStartQuery)
export class Get6MonthViralSuppressionByYearOfArtStartHandler implements IQueryHandler<Get6MonthViralSuppressionByYearOfArtStartQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: Get6MonthViralSuppressionByYearOfArtStartQuery): Promise<any> {
        const sixMonthViralSupByYearOfArtStart = this.repository
            .createQueryBuilder('f')
            .select([
                'StartARTYear startYear, SUM(VLAt6Months_Sup) vlAt6Months_Sup, CASE WHEN SUM(VLAt6Months) = 0 THEN 0 ELSE (CAST(SUM(VLAt6Months_Sup) as float)/CAST(SUM(VLAt6Months) as float)) END percentAt6Months',
            ])
            .where('f.MFLCode > 1')
            .andWhere('f.StartARTYear >= 2011');

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
            sixMonthViralSupByYearOfArtStart.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            sixMonthViralSupByYearOfArtStart.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            sixMonthViralSupByYearOfArtStart.andWhere('f.AgeGroup IN (:...agegroups)', { agegroups: query.datimAgeGroup });
        }

        if (query.gender) {
            sixMonthViralSupByYearOfArtStart.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await sixMonthViralSupByYearOfArtStart
            .groupBy('f.StartARTYear')
            .orderBy('StartARTYear')
            .getRawMany();
    }
}
