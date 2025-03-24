import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrVerifiedByCountyQuery } from '../impl/get-ct-tx-curr-verified-county.query';
import { AggregateNupi } from './../../entities/aggregate-nupi.model';

@QueryHandler(GetCtTxCurrVerifiedByCountyQuery)
export class GetCtTxCurrVerifiedByCountyHandler
    implements IQueryHandler<GetCtTxCurrVerifiedByCountyQuery> {
    constructor(
        @InjectRepository(AggregateNupi, 'mssql')
        private readonly repository: Repository<AggregateNupi>,
    ) {}

    async execute(query: GetCtTxCurrVerifiedByCountyQuery): Promise<any> {
        let txCurrByCounty = this.repository
            .createQueryBuilder('f')
            .select(['County, sum (numnupi) NumNupi'])
            .where('f.[County] IS NOT NULL');

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrByCounty = this.repository
                    .createQueryBuilder('f')
                    .select(['County, sum (adults) NumNupi'])
                    .where('f.[County] IS NOT NULL');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrByCounty = this.repository
                    .createQueryBuilder('f')
                    .select(['County, sum (children) NumNupi'])
                    .where('f.[County] IS NOT NULL');
        }

        if (query.county) {
            txCurrByCounty.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrByCounty.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurrByCounty.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurrByCounty.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurrByCounty.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurrByCounty.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            txCurrByCounty.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurrByCounty
            .groupBy('[County]')
            .orderBy('NumNupi', 'DESC')
            .getRawMany();

    }
}
