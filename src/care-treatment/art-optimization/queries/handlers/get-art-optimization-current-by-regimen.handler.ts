import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationCurrentByRegimenQuery } from '../impl/get-art-optimization-current-by-regimen.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOptimizeCurrentRegimens } from './../../entities/aggregate-optimize-current-regimens.model';

@QueryHandler(GetArtOptimizationCurrentByRegimenQuery)
export class GetArtOptimizationCurrentByRegimenHandler
    implements IQueryHandler<GetArtOptimizationCurrentByRegimenQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeCurrentRegimens, 'mssql')
        private readonly repository: Repository<
            AggregateOptimizeCurrentRegimens
        >,
    ) {}

    async execute(
        query: GetArtOptimizationCurrentByRegimenQuery,
    ): Promise<any> {
        const artOptimizationCurrentByRegimen = this.repository
            .createQueryBuilder('f')
            .select([
                'Agegroup ageGroup, RegimenLine regimenLine, CurrentRegimen currentRegimen, LastRegimenClean lastRegimen, sum(TXCurr) txCurr',
            ])
            .where('SiteCode IS NOT NULL');

        if (query.county) {
            artOptimizationCurrentByRegimen.andWhere(
                'f.County IN (:...county)',
                { county: query.county },
            );
        }

        if (query.subCounty) {
            artOptimizationCurrentByRegimen.andWhere(
                'f.Subcounty IN (:...subCounty)',
                { subCounty: query.subCounty },
            );
        }

        if (query.facility) {
            artOptimizationCurrentByRegimen.andWhere(
                'f.FacilityName IN (:...facility)',
                { facility: query.facility },
            );
        }

        if (query.partner) {
            artOptimizationCurrentByRegimen.andWhere(
                'f.PartnerName IN (:...partner)',
                { partner: query.partner },
            );
        }

        if (query.agency) {
            artOptimizationCurrentByRegimen.andWhere(
                'f.AgencyName IN (:...agency)',
                { agency: query.agency },
            );
        }

        // if (query.project) {
        //     artOptimizationCurrentByRegimen.andWhere('f.CTPartner IN (:...project)', { project: query.project });
        // }

        // if(query.month) {
        //     artOptimizationCurrentByRegimen.andWhere('f.StartARTMonth IN (:...month)', { month: query.month });
        // }

        // if (query.year) {
        //     artOptimizationCurrentByRegimen.andWhere('f.StartARTYr IN (:...year)', { year: query.year });
        // }

        if (query.gender) {
            artOptimizationCurrentByRegimen.andWhere(
                'f.Gender IN (:...gender)',
                { gender: query.gender },
            );
        }

        if (query.datimAgeGroup) {
            artOptimizationCurrentByRegimen.andWhere(
                'f.DATIMAgeGroup IN (:...datimAgeGroup)',
                { datimAgeGroup: query.datimAgeGroup },
            );
        }

        if (query.latestPregnancy) {
            artOptimizationCurrentByRegimen.andWhere(
                'f.LatestPregnancy IN (:...latestPregnancy)',
                { latestPregnancy: query.latestPregnancy },
            );
        }

        return await artOptimizationCurrentByRegimen
            .groupBy('Agegroup, RegimenLine, CurrentRegimen, LastRegimenClean')
            .orderBy('Agegroup, RegimenLine, CurrentRegimen, LastRegimenClean')
            .getRawMany();
    }
}
