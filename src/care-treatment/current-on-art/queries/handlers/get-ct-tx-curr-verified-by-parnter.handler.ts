import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactNUPI } from '../../entities/fact-nupi.model';
import { GetCtTxCurrVerifiedByPartnerQuery } from '../impl/get-ct-tx-curr-verified-partner.query';

@QueryHandler(GetCtTxCurrVerifiedByPartnerQuery)
export class GetCtTxCurrVerifiedByPartnerHandler
    implements IQueryHandler<GetCtTxCurrVerifiedByPartnerQuery> {
    constructor(
        @InjectRepository(FactNUPI, 'mssql')
        private readonly repository: Repository<FactNUPI>,
    ) {}

    async execute(query: GetCtTxCurrVerifiedByPartnerQuery): Promise<any> {
        let txCurrByPartner = this.repository
            .createQueryBuilder('f')
            .select(['CTPartner, sum (NumNUPI) NumNupi'])
            .where('f.[Gender] IS NOT NULL');

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrByPartner = this.repository
                    .createQueryBuilder('f')
                    .select(['CTPartner, sum (Adults) NumNupi'])
                    .where('f.[Gender] IS NOT NULL');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrByPartner = this.repository
                    .createQueryBuilder('f')
                    .select(['CTPartner, sum (Children) NumNupi'])
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
            txCurrByPartner.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurrByPartner.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurrByPartner.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            txCurrByPartner.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurrByPartner
            .groupBy('CTPartner')
            .orderBy('NumNupi', 'DESC')
            .getRawMany();
    }
}
