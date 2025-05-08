import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.model';
import { FacilityInfo } from '../../entities/facility-info.entity';
import { Repository } from 'typeorm';
import { GetEMRInfoQuery } from './../impl/get-emr-info.query';

@QueryHandler(GetEMRInfoQuery)
export class GetEMRInfoHandler implements IQueryHandler<GetEMRInfoQuery> {
    constructor(
        @InjectRepository(FacilityInfo)
        private readonly repository: Repository<FacilityInfo>,
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository2: Repository<FactManifest>,
    ) {}

    async execute(query: GetEMRInfoQuery): Promise<any> {
        const params = [];
        params.push(query.docket);

        let expectedSql = `SELECT DISTINCT MFLCode AS expected
                FROM NDWH.Dim.DimFacility f
                INNER JOIN ODS.Care.All_EMRSites a on a.MFL_Code = MFLCode
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
        let expected  = await this.repository2.query(expectedSql, params)

        const facilities = this.repository
            .createQueryBuilder('f')
            .select(
                `distinct count(DISTINCT mfl_code) facilities_number, infrastructure_type `,
            )
            .where(`mfl_code IN (:...mfl_codes)`, {
                mfl_codes: expected.map(
                    (e: { expected: string }) => e.expected,
                ),
            });

        return await facilities.groupBy('infrastructure_type').getRawMany();

    }
}
