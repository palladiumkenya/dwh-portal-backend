import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../entities/fact-trans-vl-overall-uptake.model';
import { GetVlOverallUptakeAndSuppressionBySexVlDoneQuery } from "../impl/get-vl-overall-uptake-and-suppression-by-sex-vl-done.query";

@QueryHandler(GetVlOverallUptakeAndSuppressionBySexVlDoneQuery)
export class GetVlOverallUptakeAndSuppressionBySexVlDoneHandler implements IQueryHandler<GetVlOverallUptakeAndSuppressionBySexVlDoneQuery> {
    constructor(
        @InjectRepository(FactTransVLOverallUptake, 'mssql')
        private readonly repository: Repository<FactTransVLOverallUptake>
    ) {
    }

    async execute(query: GetVlOverallUptakeAndSuppressionBySexVlDoneQuery): Promise<any> {
        const vlOverallUptakeAndSuppressionBySex = this.repository.createQueryBuilder('f')
            .select(['Last12MVLResult, Gender gender, COUNT ( * ) Num'])
            .where('f.MFLCode > 0')
            .andWhere('Last12MVLResult IS NOT NULL');

        if (query.county) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlOverallUptakeAndSuppressionBySex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlOverallUptakeAndSuppressionBySex
            .groupBy('Last12MVLResult, f.Gender')
            .getRawMany();
    }
}
