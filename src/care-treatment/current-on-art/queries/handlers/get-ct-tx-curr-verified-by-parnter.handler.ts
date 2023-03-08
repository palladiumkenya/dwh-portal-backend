import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrVerifiedByPartnerQuery } from '../impl/get-ct-tx-curr-verified-partner.query';
import { AggregateNupi } from './../../entities/aggregate-nupi.model';

@QueryHandler(GetCtTxCurrVerifiedByPartnerQuery)
export class GetCtTxCurrVerifiedByPartnerHandler
    implements IQueryHandler<GetCtTxCurrVerifiedByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateNupi, 'mssql')
        private readonly repository: Repository<AggregateNupi>,
    ) {}

    async execute(query: GetCtTxCurrVerifiedByPartnerQuery): Promise<any> {
        let txCurrByPartner = this.repository
            .createQueryBuilder('f')
            .select(['PartnerName CTPartner, sum (numnupi) NumNupi'])
            .where('f.[Gender] IS NOT NULL');

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrByPartner = this.repository
                    .createQueryBuilder('f')
                    .select([
                        'PartnerName CTPartner, sum (adults) NumNupi',
                    ])
                    .where('f.[Gender] IS NOT NULL');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrByPartner = this.repository
                    .createQueryBuilder('f')
                    .select([
                        'PartnerName CTPartner, sum (children) NumNupi',
                    ])
                    .where('f.[Gender] IS NOT NULL');
        }

        if (query.county) {
            txCurrByPartner.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrByPartner.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurrByPartner.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurrByPartner.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurrByPartner.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurrByPartner.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            txCurrByPartner.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurrByPartner
            .groupBy('PartnerName')
            .orderBy('NumNupi', 'DESC')
            .getRawMany();
    }
}
