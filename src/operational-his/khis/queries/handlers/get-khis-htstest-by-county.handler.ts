import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsDhis2 } from '../../entities/fact-hts-dhis2.model';
import { GetKhisHTSTESTByCountyQuery } from '../impl/get-khis-htstest-by-county.query';

@QueryHandler(GetKhisHTSTESTByCountyQuery)
export class GetKhisHTSTESTByCountyHandler
    implements IQueryHandler<GetKhisHTSTESTByCountyQuery> {
    constructor(
        @InjectRepository(FactHtsDhis2, 'mssql')
        private readonly repository: Repository<FactHtsDhis2>,
    ) {}

    async execute(query: GetKhisHTSTESTByCountyQuery): Promise<any> {
        let htsPOS = this.repository.createQueryBuilder('f').select(
            `County,
            SUM ( Tested_Total ) Tested_Total,
            SUM ( Tested_10_14_M ) + SUM ( Tested_15_19_M ) + SUM ( Tested_20_24_M ) + SUM ( Tested_25_Plus_M ) Tested_Male,
            SUM ( Tested_10_14_F ) + SUM ( Tested_15_19_F ) + SUM ( Tested_20_24_F ) + SUM ( Tested_25_Plus_F ) Tested_Female,
            SUM ( Tested_1_9 ) Tested_1_9,
            SUM ( Tested_10_14_M ) Tested_10_14_M,
            SUM ( Tested_10_14_F ) Tested_10_14_F,
            SUM ( Tested_15_19_M ) Tested_15_19_M,
            SUM ( Tested_15_19_F ) Tested_15_19_F,
            SUM ( Tested_20_24_M ) Tested_20_24_M,
            SUM ( Tested_20_24_F ) Tested_20_24_F,
            SUM ( Tested_25_Plus_M ) Tested_25_Plus_M,
            SUM ( Tested_25_Plus_F ) Tested_25_Plus_F `,
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
                SUM ( Tested_10_14_F ) + SUM ( Tested_15_19_F ) + SUM ( Tested_20_24_F ) + SUM ( Tested_25_Plus_F ) Tested_Total,
                SUM ( Tested_10_14_F ) + SUM ( Tested_15_19_F ) + SUM ( Tested_20_24_F ) + SUM ( Tested_25_Plus_F ) Tested_Female, 0 Tested_Male,
                0 Tested_1_9,
                0 Tested_10_14_M,
                SUM ( Tested_10_14_F ) Tested_10_14_F,
                0 Tested_15_19_M,
                SUM ( Tested_15_19_F ) Tested_15_19_F,
                0 Tested_20_24_M,
                SUM ( Tested_20_24_F ) Tested_20_24_F,
                0 Tested_25_Plus_M,
                SUM ( Tested_25_Plus_F ) Tested_25_Plus_F `,
            );
        } else if (query.gender && query.gender.includes('Male')) {
            htsPOS = this.repository.createQueryBuilder('f').select(
                `County,
                SUM ( Tested_10_14_M ) + SUM ( Tested_15_19_M ) + SUM ( Tested_20_24_M ) + SUM ( Tested_25_Plus_M ) Tested_Total,
                SUM ( Tested_10_14_M ) + SUM ( Tested_15_19_M ) + SUM ( Tested_20_24_M ) + SUM ( Tested_25_Plus_M ) Tested_Male, 0 Tested_Female,
                0 Tested_1_9,
                0 Tested_10_14_F,
                SUM ( Tested_10_14_M ) Tested_10_14_M,
                0 Tested_15_19_F,
                SUM ( Tested_15_19_M ) Tested_15_19_M,
                0 Tested_20_24_F,
                SUM ( Tested_20_24_M ) Tested_20_24_M,
                0 Tested_25_Plus_F,
                SUM ( Tested_25_Plus_M ) Tested_25_Plus_M `,
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
            htsPOS.andWhere('SDP IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            htsPOS.andWhere('[SDP Agency] IN (:...agencies)', {
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
