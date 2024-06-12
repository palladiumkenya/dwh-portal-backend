import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransOptimizeStartRegimen } from '../../entities/fact-trans-optimize-start-regimen.model';
import { GetVlSuppressionByRegimenQuery } from '../impl/get-vl-suppression-by-regimen.query';
import { AggregateOptimizeStartRegimens } from './../../../art-optimization/entities/aggregate-optimize-start-regimens.model';

@QueryHandler(GetVlSuppressionByRegimenQuery)
export class GetVlSuppressionByRegimenHandler implements IQueryHandler<GetVlSuppressionByRegimenQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeStartRegimens, 'mssql')
        private readonly repository: Repository<AggregateOptimizeStartRegimens>
    ) {

    }

    async execute(query: GetVlSuppressionByRegimenQuery): Promise<any> {
        const vlSuppressionByRegimen = this.repository
            .createQueryBuilder('f')
            .select([
                'f.StartRegimen regimen, ValidVLResultCategory Last12MVLResult, count(ValidVLResultCategory) count',
            ])
            .where('f.SiteCode > 0')
            .andWhere('f.StartRegimen IS NOT NULL')
            .andWhere('f.ValidVLResultCategory IS NOT NULL');

        if (query.county) {
            vlSuppressionByRegimen.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionByRegimen.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionByRegimen.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionByRegimen.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionByRegimen.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionByRegimen.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionByRegimen.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionByRegimen
            .groupBy('f.StartRegimen, f.ValidVLResultCategory')
            .orderBy('f.StartRegimen')
            .getRawMany();
    }
}
