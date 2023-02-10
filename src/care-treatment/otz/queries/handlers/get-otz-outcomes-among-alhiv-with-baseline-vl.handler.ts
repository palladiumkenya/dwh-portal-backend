import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesAmongAlhivWithBaselineVlQuery } from '../impl/get-otz-outcomes-among-alhiv-with-baseline-vl.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZ } from './../../entities/line-list-otz.model';

@QueryHandler(GetOtzOutcomesAmongAlhivWithBaselineVlQuery)
export class GetOtzOutcomesAmongAlhivWithBaselineVlHandler
    implements IQueryHandler<GetOtzOutcomesAmongAlhivWithBaselineVlQuery> {
    constructor(
        @InjectRepository(LineListOTZ, 'mssql')
        private readonly repository: Repository<LineListOTZ>,
    ) {}

    async execute(
        query: GetOtzOutcomesAmongAlhivWithBaselineVlQuery,
    ): Promise<any> {
        const baselineVl = this.repository
            .createQueryBuilder('f')
            .select([
                'AlHivEnrolledInOTZ = Count(*),' +
                    'AlHivWithBaselineVl = (SELECT COUNT(*) FROM [dbo].[LineListOTZ] WHERE FirstVL IS NOT NULL ),\n' +
                    "AlHivWithVlLessThan1000 = (SELECT COUNT(*) FROM [dbo].[LineListOTZ] WHERE (CASE WHEN FirstVL = 'Undetectable' THEN 1 WHEN FirstVL = 'DETECTED' Then 0 ELSE TRY_CONVERT(decimal, FirstVL) END) < 1000 )," +
                    "AlHivWithVlGreaterThan1000 = (SELECT COUNT(*) FROM [dbo].[LineListOTZ] WHERE (CASE WHEN FirstVL = 'Undetectable' THEN 1 WHEN FirstVL = 'DETECTED' Then 0 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 1000 )",
            ]);

        if (query.county) {
            baselineVl.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            baselineVl.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            baselineVl.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            baselineVl.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            baselineVl.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            baselineVl.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            baselineVl.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await baselineVl.getRawMany();
    }
}
