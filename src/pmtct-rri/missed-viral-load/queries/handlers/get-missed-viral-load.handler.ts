import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissedViralLoad } from '../../entities/missed-viral-load.model';
import { GetMissedViralLoadQuery } from '../impl/get-missed-viral-load.query';

@QueryHandler(GetMissedViralLoadQuery)
export class GetMissedViralLoadHandler
    implements IQueryHandler<GetMissedViralLoadQuery> {
    constructor(
        @InjectRepository(MissedViralLoad, 'mssql')
        private readonly repository: Repository<MissedViralLoad>,
    ) {}

    async execute(query: GetMissedViralLoadQuery): Promise<any> {
        let missedProf = this.repository
            .createQueryBuilder('f')
            .select(
                `FacilityName, SubCounty, County, PartnerName, AgencyName, CALHIVTxCurr, EligibleVL, VLDone, Suppressed, MissingVL, CALHIVTxCurr - Suppressed AS NonSuppressed`,
            );

        if (query.county) {
            missedProf.andWhere('f.County IN (:...county)', {
                county: query.county,
            });
        }

        if (query.subCounty) {
            missedProf.andWhere('f.Subcounty IN (:...subCounty)', {
                subCounty: query.subCounty,
            });
        }

        if (query.facility) {
            missedProf.andWhere('f.Facility_Name IN (:...facility)', {
                facility: query.facility,
            });
        }

        if (query.partner) {
            missedProf.andWhere('f.SDP IN (:...partner)', {
                partner: query.partner,
            });
        }

        if (query.agency) {
            missedProf.andWhere('f.Agency IN (:...agency)', {
                agency: query.agency,
            });
        }

        if (query.emr) {
            missedProf.andWhere('f.Facilitytype IN (:...facilitytype)', {
                facilitytype: query.emr,
            });
        }

        if (query.year) {
            missedProf.andWhere(
                `YEAR(TRY_CONVERT(date, period + '-01')) = :year`,
                {
                    year: query.year,
                },
            );
        }

        if (query.month) {
            missedProf.andWhere(
                `MONTH(TRY_CONVERT(date, period + '-01')) = :month`,
                {
                    month: query.month,
                },
            );
        }

        return await missedProf.getRawMany();
    }
}
