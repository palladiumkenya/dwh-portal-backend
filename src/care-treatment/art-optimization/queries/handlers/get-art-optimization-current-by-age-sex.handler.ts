import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationCurrentByAgeSexQuery } from '../impl/get-art-optimization-current-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOptimizeRegLines } from '../../entities/fact-trans-optimize-reg-lines.model';
import { Repository } from 'typeorm';

@QueryHandler(GetArtOptimizationCurrentByAgeSexQuery)
export class GetArtOptimizationCurrentByAgeSexHandler implements IQueryHandler<GetArtOptimizationCurrentByAgeSexQuery> {
    constructor(
        @InjectRepository(FactTransOptimizeRegLines, 'mssql')
        private readonly repository: Repository<FactTransOptimizeRegLines>
    ) {

    }

    async execute(query: GetArtOptimizationCurrentByAgeSexQuery): Promise<any> {
        const artOptimizationCurrentByAgeSex = this.repository.createQueryBuilder('f')
        //TODO:: Add Current Regimen
            .select(['CurrentRegimen regimen, Gender gender, DATIM_AgeGroup datimAgeGroup, sum(TXCurr) txCurr'])
            .where('MFLCode IS NOT NULL');

        if (query.county) {
            artOptimizationCurrentByAgeSex.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationCurrentByAgeSex.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationCurrentByAgeSex.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationCurrentByAgeSex.andWhere('f.CTPartner IN (:...partner)', { partner: query.partner });
        }

        if (query.agency) {
            artOptimizationCurrentByAgeSex.andWhere('f.CTAgency IN (:...agency)', { agency: query.agency });
        }

        // if (query.project) {
        //     artOptimizationCurrentByAgeSex.andWhere('f.project IN (:...project)', { project: query.project });
        // }

        // if(query.month) {
        //     artOptimizationCurrentByAgeSex.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        // }

        // if (query.year) {
        //     artOptimizationCurrentByAgeSex.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        // }

        if (query.gender) {
            artOptimizationCurrentByAgeSex.andWhere('f.Gender IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            artOptimizationCurrentByAgeSex.andWhere('f.DATIM_AgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.populationType) {
            artOptimizationCurrentByAgeSex.andWhere('f.PopulationType IN (:...populationType)', { populationType: query.populationType });
        }

        if (query.latestPregnancy) {
            artOptimizationCurrentByAgeSex.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await artOptimizationCurrentByAgeSex
            .groupBy('CurrentRegimen, Gender, DATIM_AgeGroup')
            .orderBy('CurrentRegimen, Gender, DATIM_AgeGroup')
            .getRawMany();
    }
}
