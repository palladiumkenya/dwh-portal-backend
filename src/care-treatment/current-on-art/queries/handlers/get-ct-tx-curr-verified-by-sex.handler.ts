import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrVerifiedByAgeAndSexQuery } from './../impl/get-ct-tx-curr-verified-age-group-sex.query';
import { FactNUPI } from '../../entities/fact-nupi.model';

@QueryHandler(GetCtTxCurrVerifiedByAgeAndSexQuery)
export class GetCtTxCurrVerifiedBySexHandler
    implements IQueryHandler<GetCtTxCurrVerifiedByAgeAndSexQuery> {
    constructor(
        @InjectRepository(FactNUPI, 'mssql')
        private readonly repository: Repository<FactNUPI>,
    ) {}

    async execute(query: GetCtTxCurrVerifiedByAgeAndSexQuery): Promise<any> {
        let txCurrBySex = this.repository
            .createQueryBuilder('f')
            .select(['Gender, DATIM_AgeGroup, sum (NumNUPI) NumNupi'])
            .where('f.[Gender] IS NOT NULL and DATIM_AgeGroup is not NULL');

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrBySex = this.repository
                    .createQueryBuilder('f')
                    .select(['Gender, DATIM_AgeGroup, sum (Adults) NumNupi'])
                    .where('f.[Gender] IS NOT NULL and DATIM_AgeGroup is not NULL');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrBySex = this.repository
                    .createQueryBuilder('f')
                    .select(['Gender, DATIM_AgeGroup, sum (Children) NumNupi'])
                    .where(
                        'f.[Gender] IS NOT NULL and DATIM_AgeGroup is not NULL',
                    );
        }

        if (query.county) {
            txCurrBySex.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrBySex.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurrBySex.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurrBySex.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurrBySex.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurrBySex.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            txCurrBySex.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurrBySex
            .groupBy('Gender, DATIM_AgeGroup')
            .orderBy('DATIM_AgeGroup')
            .getRawMany();
    }
}
