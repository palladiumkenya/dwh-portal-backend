import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissedEIDTesting } from '../../entities/missed-eid-testing.model';
import { GetMissedEIDMissingPCRQuery } from './../impl/get-missed-eid-missing-pcr.query';

@QueryHandler(GetMissedEIDMissingPCRQuery)
export class GetMissedEIDMissngPCRHandler
    implements IQueryHandler<GetMissedEIDMissingPCRQuery> {
    constructor(
        @InjectRepository(MissedEIDTesting, 'mssql')
        private readonly repository: Repository<MissedEIDTesting>,
    ) {}

    async execute(query: GetMissedEIDMissingPCRQuery): Promise<any> {
        let missedEID = this.repository
            .createQueryBuilder('f')
            .select(
                `Facility_Name, SubCounty, County, SDP, Agency, MissingPCRTests`,
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

        return await missedEID.getRawMany();
    }
}
