import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissedEIDTesting } from '../../entities/missed-eid-testing.model';
import { GetMissedEIDAgeFirstPCRSDPQuery } from '../impl/get-missed-eid-age-first-pcr-sdp.query';

@QueryHandler(GetMissedEIDAgeFirstPCRSDPQuery)
export class GetMissedEIDAgeFirstPCRSDPHandler
    implements IQueryHandler<GetMissedEIDAgeFirstPCRSDPQuery> {
    constructor(
        @InjectRepository(MissedEIDTesting, 'mssql')
        private readonly repository: Repository<MissedEIDTesting>,
    ) {}

    async execute(query: GetMissedEIDAgeFirstPCRSDPQuery): Promise<any> {
        let missedEID = this.repository
            .createQueryBuilder('f')
            .select(
                `SUM(Lessthan2Months) lesst2Months, SUM(Within12Months) within12Months, SUM(Above1Year) above1Year, SUM(MissingPCRTests) missingPCRTests, SDP`,
            );

        if (query.county) {
            missedEID.andWhere('f.County IN (:...county)', {
                county: query.county,
            });
        }

        if (query.subCounty) {
            missedEID.andWhere('f.SubCounty IN (:...subCounty)', {
                subCounty: query.subCounty,
            });
        }

        if (query.facility) {
            missedEID.andWhere('f.Facility_Name IN (:...facility)', {
                facility: query.facility,
            });
        }

        if (query.partner) {
            missedEID.andWhere('f.SDP IN (:...partner)', {
                partner: query.partner,
            });
        }

        if (query.agency) {
            missedEID.andWhere('f.Agency IN (:...agency)', {
                agency: query.agency,
            });
        }

        if (query.emr) {
            missedEID.andWhere('f.Facilitytype IN (:...facilitytype)', {
                facilitytype: query.emr,
            });
        }

        if (query.year) {
            missedEID.andWhere(`YEAR(TRY_CONVERT(date, Period)) = :year`, {
                year: query.year,
            });
        }

        if (query.month) {
            missedEID.andWhere(`MONTH(TRY_CONVERT(date, Period)) = :month`, {
                month: query.month,
            });
        }

        return await missedEID
            .groupBy('SDP')
            .orderBy('SUM(Lessthan2Months)', 'DESC')
            .getRawMany();
    }
}
