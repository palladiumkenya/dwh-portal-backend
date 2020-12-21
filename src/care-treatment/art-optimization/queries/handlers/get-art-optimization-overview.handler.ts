import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationOverviewQuery } from '../impl/get-art-optimization-overview.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOptimizeRegLines } from '../../entities/fact-trans-optimize-reg-lines.model';
import { Repository } from 'typeorm';

@QueryHandler(GetArtOptimizationOverviewQuery)
export class GetArtOptimizationOverviewHandler implements IQueryHandler<GetArtOptimizationOverviewQuery> {
    constructor(
        @InjectRepository(FactTransOptimizeRegLines, 'mssql')
        private readonly repository: Repository<FactTransOptimizeRegLines>
    ) {

    }

    async execute(query: GetArtOptimizationOverviewQuery): Promise<any> {
        const artOptimizationOverview = this.repository.createQueryBuilder('f')
            .select(['Agegroup ageGroup, Gender gender, CurrentRegimen currentRegimen, RegimenLine regimenLine, sum(TXCurr) txCurr'])
            .where('MFLCode IS NOT NULL');

        if (query.county) {
            artOptimizationOverview.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationOverview.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationOverview.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationOverview.andWhere('f.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if (query.agency) {
        //     artOptimizationOverview.andWhere('f.agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     artOptimizationOverview.andWhere('f.project IN (:...project)', { project: query.project });
        // }

        // if(query.month) {
        //     artOptimizationOverview.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        // }

        // if (query.year) {
        //     artOptimizationOverview.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        // }

        return await artOptimizationOverview
            .groupBy('Agegroup, Gender, CurrentRegimen, RegimenLine')
            .orderBy('Agegroup, Gender, CurrentRegimen, RegimenLine')
            .getRawMany();
    }
}
