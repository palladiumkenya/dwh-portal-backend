import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrDistributionByCountyQuery } from '../impl/get-ct-tx-curr-distribution-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import { FactTransNewCohort } from 'src/care-treatment/new-on-art/entities/fact-trans-new-cohort.model';

@QueryHandler(GetCtTxCurrDistributionByCountyQuery)
export class GetCtTxCurrDistributionByCountyHandler
    implements IQueryHandler<GetCtTxCurrDistributionByCountyQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>,
    ) {}

    async execute(query: GetCtTxCurrDistributionByCountyQuery): Promise<any> {
        let txCurrDistributionByCounty = this.repository
            .createQueryBuilder('f')
            .select(['[County],count(*) txCurr'])
            .where("ARTOutcome ='V' AND ageLV BETWEEN 0 and 120");

        if (query.county) {
            txCurrDistributionByCounty.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrDistributionByCounty.andWhere(
                'f.Subcounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            txCurrDistributionByCounty.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            txCurrDistributionByCounty.andWhere(
                'f.CTPartner IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            txCurrDistributionByCounty.andWhere(
                'f.CTAgency IN (:...agencies)',
                { agencies: query.agency },
            );
        }

        if (query.gender) {
            txCurrDistributionByCounty.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrDistributionByCounty.andWhere('f.ageLV >= 18');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrDistributionByCounty.andWhere('f.ageLV < 18');
        }

        if (query.datimAgeGroup) {
            txCurrDistributionByCounty.andWhere(
                'f.DATIM_AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await txCurrDistributionByCounty
            .groupBy('[County]')
            .orderBy('count(*)', 'DESC')
            .getRawMany();
        
    }
}
