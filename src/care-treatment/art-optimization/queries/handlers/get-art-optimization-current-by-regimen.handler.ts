import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationCurrentByRegimenQuery } from '../impl/get-art-optimization-current-by-regimen.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOptimizeRegLines } from '../../entities/fact-trans-optimize-reg-lines.model';
import { Repository } from 'typeorm';

@QueryHandler(GetArtOptimizationCurrentByRegimenQuery)
export class GetArtOptimizationCurrentByRegimenHandler implements IQueryHandler<GetArtOptimizationCurrentByRegimenQuery> {
    constructor(
        @InjectRepository(FactTransOptimizeRegLines, 'mssql')
        private readonly repository: Repository<FactTransOptimizeRegLines>
    ) {

    }

    async execute(query: GetArtOptimizationCurrentByRegimenQuery): Promise<any> {
        const artOptimizationCurrentByRegimen = this.repository.createQueryBuilder('f')
            .select(['Agegroup ageGroup, Lastregimen lastRegimen, sum(TXCurr) txCurr'])
            .where('MFLCode IS NOT NULL');

        if (query.county) {
            artOptimizationCurrentByRegimen.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationCurrentByRegimen.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationCurrentByRegimen.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationCurrentByRegimen.andWhere('f.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if (query.agency) {
        //     artOptimizationCurrentByRegimen.andWhere('f.agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     artOptimizationCurrentByRegimen.andWhere('f.CTPartner IN (:...project)', { project: query.project });
        // }

        // if(query.month) {
        //     artOptimizationCurrentByRegimen.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        // }

        // if (query.year) {
        //     artOptimizationCurrentByRegimen.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        // }

        return await artOptimizationCurrentByRegimen
            .groupBy('Agegroup, Lastregimen')
            .getRawMany();
    }
}
