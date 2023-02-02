import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrVerifiedQuery } from '../impl/get-ct-tx-curr-verified.query';
import { AggregateNupi } from './../../entities/aggregate-nupi.model';

@QueryHandler(GetCtTxCurrVerifiedQuery)
export class GetCtTxCurrVerifiedHandler
    implements IQueryHandler<GetCtTxCurrVerifiedQuery> {
    constructor(
        @InjectRepository(AggregateNupi, 'mssql')
        private readonly repository: Repository<AggregateNupi>,
    ) {}

    async execute(query: GetCtTxCurrVerifiedQuery): Promise<any> {
        let txCurr = this.repository
            .createQueryBuilder('f')
            .select(['sum (number_nupi) NumNupi'])
            .where('f.[Gender] IS NOT NULL');

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurr = this.repository
                    .createQueryBuilder('f')
                    .select(['sum (number_adults) NumNupi'])
                    .where('f.[Gender] IS NOT NULL');
            else if (query.datimAgePopulations.includes('<18'))
                txCurr = this.repository
                    .createQueryBuilder('f')
                    .select(['sum (number_children) NumNupi'])
                    .where('f.[Gender] IS NOT NULL');
        }

        if (query.county) {
            txCurr.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurr.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurr.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurr.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurr.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurr.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            txCurr.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurr.getRawOne();
    }
}
