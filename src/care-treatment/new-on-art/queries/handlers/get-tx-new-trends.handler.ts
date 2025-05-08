import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransNewlyStarted } from '../../entities/fact-trans-newly-started.model';
import { Repository } from 'typeorm';
import { GetTxNewTrendsQuery } from '../impl/get-tx-new-trends.query';
import { AggregateCohortRetention } from './../../entities/aggregate-cohort-retention.model';

@QueryHandler(GetTxNewTrendsQuery)
export class GetTxNewTrendsHandler
    implements IQueryHandler<GetTxNewTrendsQuery> {
    constructor(
        @InjectRepository(AggregateCohortRetention, 'mssql')
        private readonly repository: Repository<AggregateCohortRetention>,
    ) {}

    async execute(query: GetTxNewTrendsQuery): Promise<any> {
        const txNew = this.repository
            .createQueryBuilder('f')
            .select([
                `YEAR (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) year, MONTH (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) month, SUM([patients_startedART]) txNew, Sex gender`,
            ])
            .where('f.[patients_startedART] > 0');

        if (query.partner) {
            txNew.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.county) {
            txNew.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txNew.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txNew.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.month) {
            txNew.andWhere(`MONTH (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) = :month`, { month: query.month });
        }

        if (query.agency) {
            txNew.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.gender) {
            txNew.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgeGroup) {
            txNew.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.year) {
            const yearVal = new Date().getFullYear();
            if (query.year == yearVal && !query.month) {
                txNew.andWhere(`YEAR (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) >= :startYear`, {
                    startYear: new Date(
                        new Date().setFullYear(new Date().getFullYear() - 1),
                    ).getFullYear(),
                });
            } else {
                txNew.andWhere(`YEAR (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) = :startYear`, {
                    startYear: query.year,
                });
            }
        }

        return await txNew
            .groupBy(
                `YEAR (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)), MONTH (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)), f.Sex`,
            )
            .orderBy(
                `YEAR (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)), MONTH (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE))`,
            )
            .getRawMany();
    }
}
