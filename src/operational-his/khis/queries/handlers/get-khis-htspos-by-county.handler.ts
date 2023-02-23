import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsDhis2 } from '../../entities/fact-hts-dhis2.model';
import { GetKhisHTSPOSByCountyQuery } from '../impl/get-khis-htspos-by-county.query';

@QueryHandler(GetKhisHTSPOSByCountyQuery)
export class GetKhisHTSPOSByCountyHandler
    implements IQueryHandler<GetKhisHTSPOSByCountyQuery> {
    constructor(
        @InjectRepository(FactHtsDhis2, 'mssql')
        private readonly repository: Repository<FactHtsDhis2>,
    ) {}

    async execute(query: GetKhisHTSPOSByCountyQuery): Promise<any> {
        let htsPOS = this.repository.createQueryBuilder('f').select(
            `County,
            SUM ( Positive_Total ) Positive_Total,
            SUM ( Positive_10_14_M ) + SUM ( Positive_15_19_M ) + SUM ( Positive_20_24_M ) + SUM ( Positive_25_Plus_M ) Positive_Male,
            SUM ( Positive_10_14_F ) + SUM ( Positive_15_19_F ) + SUM ( Positive_20_24_F ) + SUM ( Positive_25_Plus_F ) Positive_Female,
            SUM ( Positive_1_9 ) Positive_1_9,
            SUM ( Positive_10_14_M ) Positive_10_14_M,
            SUM ( Positive_10_14_F ) Positive_10_14_F,
            SUM ( Positive_15_19_M ) Positive_15_19_M,
            SUM ( Positive_15_19_F ) Positive_15_19_F,
            SUM ( Positive_20_24_M ) Positive_20_24_M,
            SUM ( Positive_20_24_F ) Positive_20_24_F,
            SUM ( Positive_25_Plus_M ) Positive_25_Plus_M,
            SUM ( Positive_25_Plus_F ) Positive_25_Plus_F `,
        );

        if (
            query.gender &&
            query.gender.includes('Female') &&
            query.gender.includes('Male')
        ) {
            // No action
        } else if (query.gender && query.gender.includes('Female')) {
            htsPOS = this.repository.createQueryBuilder('f').select(
                `County,
                SUM ( Positive_10_14_F ) + SUM ( Positive_15_19_F ) + SUM ( Positive_20_24_F ) + SUM ( Positive_25_Plus_F ) Positive_Total,
                SUM ( Positive_10_14_F ) + SUM ( Positive_15_19_F ) + SUM ( Positive_20_24_F ) + SUM ( Positive_25_Plus_F ) Positive_Female, 0 Positive_Male,
                0 Positive_1_9,
                0 Positive_10_14_M,
                SUM ( Positive_10_14_F ) Positive_10_14_F,
                0 Positive_15_19_M,
                SUM ( Positive_15_19_F ) Positive_15_19_F,
                0 Positive_20_24_M,
                SUM ( Positive_20_24_F ) Positive_20_24_F,
                0 Positive_25_Plus_M,
                SUM ( Positive_25_Plus_F ) Positive_25_Plus_F `,
            );
        } else if (query.gender && query.gender.includes('Male')) {
            htsPOS = this.repository.createQueryBuilder('f').select(
                `County,
                SUM ( Positive_10_14_M ) + SUM ( Positive_15_19_M ) + SUM ( Positive_20_24_M ) + SUM ( Positive_25_Plus_M ) Positive_Total,
                SUM ( Positive_10_14_M ) + SUM ( Positive_15_19_M ) + SUM ( Positive_20_24_M ) + SUM ( Positive_25_Plus_M ) Positive_Male, 0 Positive_Female,
                0 Positive_1_9,
                0 Positive_10_14_F,
                SUM ( Positive_10_14_M ) Positive_10_14_M,
                0 Positive_15_19_F,
                SUM ( Positive_15_19_M ) Positive_15_19_M,
                0 Positive_20_24_F,
                SUM ( Positive_20_24_M ) Positive_20_24_M,
                0 Positive_25_Plus_F,
                SUM ( Positive_25_Plus_M ) Positive_25_Plus_M `,
            );
        }

        if (query.county) {
            htsPOS.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            htsPOS.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            htsPOS.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            htsPOS.andWhere('partnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            htsPOS.andWhere('[AgencyName] IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.year) {
            htsPOS.andWhere('ReportMonth_Year = :year', {
                year: query.year.toString() + query.month.toString(),
            });
        }

        return await htsPOS.groupBy('County').getRawMany();
    }
}
