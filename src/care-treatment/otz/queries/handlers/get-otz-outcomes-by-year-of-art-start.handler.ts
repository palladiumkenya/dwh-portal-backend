import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesByYearOfArtStartQuery } from '../impl/get-otz-outcomes-by-year-of-art-start.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzOutcome } from '../../entities/fact-trans-otz-outcome.model';
import { Repository } from 'typeorm';
import { AggregateOTZOutcome } from './../../entities/aggregate-otz-outcome.model';
import { LineListOTZ } from './../../entities/line-list-otz.model';

@QueryHandler(GetOtzOutcomesByYearOfArtStartQuery)
export class GetOtzOutcomesByYearOfArtStartHandler implements IQueryHandler<GetOtzOutcomesByYearOfArtStartQuery> {
    constructor(
        @InjectRepository(LineListOTZ, 'mssql')
        private readonly repository: Repository<LineListOTZ>
    ) {
    }
    async execute(query: GetOtzOutcomesByYearOfArtStartQuery): Promise<any> {
        const otzOutcomesByYearOfArtStart = this.repository
            .createQueryBuilder('f')
            .select([
                "YEAR([startARTDate]) OTZStart_Year, CASE WHEN [TransitionAttritionReason] IS NULL THEN 'TransitionAttritionReason' ELSE [TransitionAttritionReason] END AS Outcome, count(*) outcomesByYearOfArtStart",
            ])
            .andWhere(
                'f.MFLCode IS NOT NULL and TransitionAttritionReason IS NOT NULL',
            );

        if (query.county) {
            otzOutcomesByYearOfArtStart.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzOutcomesByYearOfArtStart.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzOutcomesByYearOfArtStart.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzOutcomesByYearOfArtStart.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzOutcomesByYearOfArtStart.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            otzOutcomesByYearOfArtStart.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            otzOutcomesByYearOfArtStart.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await otzOutcomesByYearOfArtStart
            .groupBy('YEAR([startARTDate]), TransitionAttritionReason')
            .getRawMany();
    }
}
