import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetVlMedianTimeToFirstVlByPartnerQuery } from '../impl/get-vl-median-time-to-first-vl-by-partner.query';
import { FactTimeToVlLast12M } from '../../entities/fact-time-to-vl-last-12m.model';
import { AggregateTimeToVL12M } from '../../entities/aggregate-time-to-vl-last-12m.model';

@QueryHandler(GetVlMedianTimeToFirstVlByPartnerQuery)
export class GetVlMedianTimeToFirstVlByPartnerHandler
    implements IQueryHandler<GetVlMedianTimeToFirstVlByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateTimeToVL12M, 'mssql')
        private readonly repository: Repository<AggregateTimeToVL12M>,
    ) {}

    async execute(query: GetVlMedianTimeToFirstVlByPartnerQuery): Promise<any> {
        let medianTimeToFirstVlSql = this.repository
            .createQueryBuilder('f')
            .select([
                'PartnerName Partner, MedianTimeToFirstVL_Partner medianTime',
            ])
            .where('f.[PartnerName] IS NOT NULL')
            .andWhere('f.MFLCode IS NOT NULL');

        if (query.county) {
            medianTimeToFirstVlSql = this.repository
                .createQueryBuilder('f')
                .select([
                    'PartnerName Partner, MedianTimeToFirstVL_Partner medianTime',
                ])
                .andWhere('f.County IN (:...counties)', {
                    counties: query.county,
                });

            return await medianTimeToFirstVlSql
                .groupBy('PartnerName, MedianTimeToFirstVL_Partner')
                .orderBy('f.MedianTimeToFirstVL_Partner', 'DESC')
                .getRawMany();
        }

        if (query.subCounty) {
            medianTimeToFirstVlSql = this.repository
                .createQueryBuilder('f')
                .select([
                    'PartnerName Partner, MedianTimeToFirstVL_Partner medianTime',
                ])
                .andWhere('f.SubCounty IN (:...subCounties)', {
                    subCounties: query.subCounty,
                });

            return await medianTimeToFirstVlSql
                .groupBy('PartnerName, MedianTimeToFirstVL_Partner')
                .orderBy('f.MedianTimeToFirstVL_Partner', 'DESC')
                .getRawMany();
        }

        if (query.partner) {
            medianTimeToFirstVlSql = this.repository
                .createQueryBuilder('f')
                .select([
                    'PartnerName Partner, MedianTimeToFirstVL_Partner medianTime',
                ])
                .andWhere('f.PartnerName IN (:...partners)', {
                    partners: query.partner,
                });

            return await medianTimeToFirstVlSql
                .groupBy('PartnerName, MedianTimeToFirstVL_Partner')
                .orderBy('f.MedianTimeToFirstVL_Partner', 'DESC')
                .getRawMany();
        }

        if (query.agency) {
            medianTimeToFirstVlSql = this.repository
                .createQueryBuilder('f')
                .select([
                    'PartnerName Partner, MedianTimeToFirstVL_Partner medianTime',
                ])
                .andWhere('f.AgencyName IN (:...agencies)', {
                    agencies: query.agency,
                });

            return await medianTimeToFirstVlSql
                .groupBy('PartnerName, MedianTimeToFirstVL_Partner')
                .orderBy('f.MedianTimeToFirstVL_Partner', 'DESC')
                .getRawMany();
        }
//TODO:: ADD AGE GROUP
        // if (query.datimAgeGroup) {
        //     medianTimeToFirstVlSql.andWhere(
        //         'f.AgeGroup IN (:...ageGroups)',
        //         { ageGroups: query.datimAgeGroup },
        //     );
        // }

        if (query.gender) {
            medianTimeToFirstVlSql.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await medianTimeToFirstVlSql
            .groupBy('PartnerName, MedianTimeToFirstVL_Partner')
            .orderBy('f.MedianTimeToFirstVL_Partner', 'DESC')
            .getRawMany();
    }
}
