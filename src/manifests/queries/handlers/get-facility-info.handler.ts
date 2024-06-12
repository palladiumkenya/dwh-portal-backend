import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.model';
import { FacilityInfo } from '../../entities/facility-info.entity';
import { Repository } from 'typeorm';
import { GetFacilityInfoQuery } from '../impl/get-facility-info.query';
import { EMRInfo } from '../../entities/emr-info.entity';

@QueryHandler(GetFacilityInfoQuery)
export class GetFacilityInfoHandler
    implements IQueryHandler<GetFacilityInfoQuery> {
    constructor(
        @InjectRepository(FacilityInfo)
        private readonly repository: Repository<FacilityInfo>,
        @InjectRepository(EMRInfo)
        private readonly repository1: Repository<EMRInfo>,
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository2: Repository<FactManifest>,
    ) {}

    async execute(query: GetFacilityInfoQuery): Promise<any> {
        const params = [];
        params.push(query.docket);

        let expectedSql = `SELECT DISTINCT MFLCode AS expected
                FROM NDWH.DBO.DimFacility f
                INNER JOIN ODS.dbo.All_EMRSites a on a.MFL_Code = MFLCode
                WHERE (isCT = 1)`;
        if (query.county) {
            expectedSql = `${expectedSql} and f.County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }
        if (query.subCounty) {
            expectedSql = `${expectedSql} and f.subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }
        if (query.agency) {
            expectedSql = `${expectedSql} and SDP_Agency IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`;
        }
        if (query.partner) {
            expectedSql = `${expectedSql} and SDP IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }
        let expected = await this.repository2.query(expectedSql, params);

        const facilities = this.repository
            .createQueryBuilder('fac')
            .select(`distinct count(DISTINCT mfl_code) facilities_number`)
            .leftJoin(EMRInfo, 'emr', 'emr.facility_info_id = fac.id')
            .where(`mfl_code IN (:...mfl_codes)`, {
                mfl_codes: expected.map(
                    (e: { expected: string }) => e.expected,
                ),
            });
        
        if (query.year && query.month) {
            facilities.andWhere('month(date_of_emr_impl) = :month', {
                month: query.month,
            });
            facilities.andWhere('year(date_of_emr_impl) = :year', {
                year: query.year,
            });
        }

        return await facilities.getRawOne();
    }
}
