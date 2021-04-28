import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationNewByCountyQuery } from '../impl/get-art-optimization-new-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOptimizeStartRegimen } from '../../entities/fact-trans-optimize-start-regimen.model';
import { Repository } from 'typeorm';

@QueryHandler(GetArtOptimizationNewByCountyQuery)
export class GetArtOptimizationNewByCountyHandler implements IQueryHandler<GetArtOptimizationNewByCountyQuery> {
    constructor(
        @InjectRepository(FactTransOptimizeStartRegimen, 'mssql')
        private readonly repository: Repository<FactTransOptimizeStartRegimen>
    ) {

    }

    async execute(query: GetArtOptimizationNewByCountyQuery): Promise<any> {
        const artOptimizationNewByCounty = this.repository.createQueryBuilder('f')
            .select(['County county, StartRegimen startRegimen, StartARTYr year, StartARTMonth month, sum(TXCurr) txCurr'])
            .where('MFLCode IS NOT NULL');

        if (query.county) {
            artOptimizationNewByCounty.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationNewByCounty.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationNewByCounty.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationNewByCounty.andWhere('f.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if (query.agency) {
        //     artOptimizationNewByCounty.andWhere('f.agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     artOptimizationNewByCounty.andWhere('f.project IN (:...project)', { project: query.project });
        // }

        if(query.month) {
            artOptimizationNewByCounty.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        }

        if (query.year) {
            artOptimizationNewByCounty.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        }

        if (query.gender) {
            artOptimizationNewByCounty.andWhere('f.Gender IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            artOptimizationNewByCounty.andWhere('f.DATIM_AgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.populationType) {
            artOptimizationNewByCounty.andWhere('f.PopulationType IN (:...populationType)', { populationType: query.populationType });
        }

        if (query.latestPregnancy) {
            artOptimizationNewByCounty.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await artOptimizationNewByCounty
            .groupBy('County, StartRegimen, StartARTYr, StartARTMonth')
            .orderBy('County, StartRegimen, StartARTYr, StartARTMonth')
            .getRawMany();
    }
}
