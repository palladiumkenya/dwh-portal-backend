import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissedMaternalHaart } from '../../entities/missed-maternal-haart.model';
import { GetMissedHAARTBySDPQuery } from '../impl/get-missed-haart-by-sdp.query';

@QueryHandler(GetMissedHAARTBySDPQuery)
export class GetMissedHAARTBySDPHandler
    implements IQueryHandler<GetMissedHAARTBySDPQuery> {
    constructor(
        @InjectRepository(MissedMaternalHaart, 'mssql')
        private readonly repository: Repository<MissedMaternalHaart>,
    ) {}

    async execute(query: GetMissedHAARTBySDPQuery): Promise<any> {
        let missedHAART = this.repository
            .createQueryBuilder('f')
            .select(
                `SUM(KnownPositives) known, SUM(New) new, sum(NotonArt) notart, SDP`,
            );

        if (query.county) {
            missedHAART.andWhere('f.County IN (:...county)', {
                county: query.county,
            });
        }

        if (query.subCounty) {
            missedHAART.andWhere('f.SubCounty IN (:...subCounty)', {
                subCounty: query.subCounty,
            });
        }

        if (query.facility) {
            missedHAART.andWhere('f.Facility_Name IN (:...facility)', {
                facility: query.facility,
            });
        }

        if (query.partner) {
            missedHAART.andWhere('f.SDP IN (:...partner)', {
                partner: query.partner,
            });
        }

        if (query.agency) {
            missedHAART.andWhere('f.Agency IN (:...agency)', {
                agency: query.agency,
            });
        }

        if (query.emr) {
            missedHAART.andWhere('f.Facilitytype IN (:...facilitytype)', {
                facilitytype: query.emr,
            });
        }

        if (query.year) {
            missedHAART.andWhere(`YEAR(TRY_CONVERT(date, Period)) = :year`, {
                year: query.year,
            });
        }

        if (query.month) {
            missedHAART.andWhere(`MONTH(TRY_CONVERT(date, Period)) = :month`, {
                month: query.month,
            });
        }

        return await missedHAART
            .groupBy('SDP')
            .orderBy('SUM(NotonArt)', 'DESC')
            .getRawMany();
    }
}
