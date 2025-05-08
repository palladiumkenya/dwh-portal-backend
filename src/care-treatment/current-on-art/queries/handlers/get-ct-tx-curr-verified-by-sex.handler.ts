import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrVerifiedByAgeAndSexQuery } from '../impl/get-ct-tx-curr-verified-age-group-sex.query';
import { AggregateNupi } from '../../entities/aggregate-nupi.model';

@QueryHandler(GetCtTxCurrVerifiedByAgeAndSexQuery)
export class GetCtTxCurrVerifiedBySexHandler
    implements IQueryHandler<GetCtTxCurrVerifiedByAgeAndSexQuery> {
    constructor(
        @InjectRepository(AggregateNupi, 'mssql')
        private readonly repository: Repository<AggregateNupi>,
    ) {}

    async execute(query: GetCtTxCurrVerifiedByAgeAndSexQuery): Promise<any> {
        let txCurrBySex = this.repository
            .createQueryBuilder('f')
            .select(['Sex Gender, AgeGroup, sum (numnupi) NumNupi'])
            .where('f.[Sex] IS NOT NULL and AgeGroup is not NULL');

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrBySex = this.repository
                    .createQueryBuilder('f')
                    .select(['Sex Gender, AgeGroup, sum (adults) NumNupi'])
                    .where('f.[Sex] IS NOT NULL and AgeGroup is not NULL');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrBySex = this.repository
                    .createQueryBuilder('f')
                    .select(['Sex Gender, AgeGroup, sum (children) NumNupi'])
                    .where(
                        'f.[Sex] IS NOT NULL and AgeGroup is not NULL',
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
            txCurrBySex.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurrBySex.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurrBySex.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            txCurrBySex.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurrBySex
            .groupBy('Sex, AgeGroup')
            .orderBy('AgeGroup')
            .getRawMany();
    }
}
