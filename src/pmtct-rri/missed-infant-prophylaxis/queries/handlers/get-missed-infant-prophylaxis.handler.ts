import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissedInfantProphylaxis } from '../../entities/missed-infact-prophylaxis.model';
import { GetMissedInfantProphylaxisQuery } from '../impl/get-missed-infant-prophylaxis.query';

@QueryHandler(GetMissedInfantProphylaxisQuery)
export class GetMissedInfantProphylaxisHandler
    implements IQueryHandler<GetMissedInfantProphylaxisQuery> {
    constructor(
        @InjectRepository(MissedInfantProphylaxis, 'mssql')
        private readonly repository: Repository<MissedInfantProphylaxis>,
    ) {}

    async execute(query: GetMissedInfantProphylaxisQuery): Promise<any> {
        let missedProf = this.repository
            .createQueryBuilder('f')
            .select(
                `Facility_Name, SubCounty, County, SDP, Agency, NoOfInfantsGivenProphylaxis, NoOfInfantsNotGivenProphylaxis, NoOfPositiveMothers, NoOfInfantsNotGivenProphylaxisKnownPosANC NoOfInfantsNotGivenProphylaxisKnownPos, NoOfInfantsNotGivenProphylaxisNewPosANC NoOfInfantsNotGivenProphylaxisNewPos`,
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
