import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationNewByPartnerQuery } from '../impl/get-art-optimization-new-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOptimizeStartRegimen } from '../../entities/fact-trans-optimize-start-regimen.model';
import { Repository } from 'typeorm';

@QueryHandler(GetArtOptimizationNewByPartnerQuery)
export class GetArtOptimizationNewByPartnerHandler implements IQueryHandler<GetArtOptimizationNewByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransOptimizeStartRegimen, 'mssql')
        private readonly repository: Repository<FactTransOptimizeStartRegimen>
    ) {

    }

    async execute(query: GetArtOptimizationNewByPartnerQuery): Promise<any> {
        const artOptimizationNewByPartner = this.repository.createQueryBuilder('f')
            .select(['CTPartner partner, StartRegimen startRegimen, StartARTYr year, StartARTMonth month, sum(TXCurr) txCurr'])
            .where('MFLCode IS NOT NULL');

        if (query.county) {
            artOptimizationNewByPartner.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationNewByPartner.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationNewByPartner.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationNewByPartner.andWhere('f.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if (query.agency) {
        //     artOptimizationNewByPartner.andWhere('f.agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     artOptimizationNewByPartner.andWhere('f.project IN (:...project)', { project: query.project });
        // }

        if(query.month) {
            artOptimizationNewByPartner.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        }

        if (query.year) {
            artOptimizationNewByPartner.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        }

        if (query.gender) {
            artOptimizationNewByPartner.andWhere('f.Gender IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            artOptimizationNewByPartner.andWhere('f.DATIM_AgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.populationType) {
            artOptimizationNewByPartner.andWhere('f.PopulationType IN (:...populationType)', { populationType: query.populationType });
        }

        if (query.latestPregnancy) {
            artOptimizationNewByPartner.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await artOptimizationNewByPartner
            .groupBy('CTPartner, StartRegimen, StartARTYr, StartARTMonth')
            .orderBy('CTPartner, StartRegimen, StartARTYr, StartARTMonth')
            .getRawMany();
    }
}
