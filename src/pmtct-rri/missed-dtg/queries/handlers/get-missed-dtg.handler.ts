import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissedDTGOptimization } from '../../entities/missed-dtg-optimization.model';
import { GetMissedDTGQuery } from '../impl/get-missed-dtg.query';

@QueryHandler(GetMissedDTGQuery)
export class GetMissedDTGHandler
    implements IQueryHandler<GetMissedDTGQuery> {
    constructor(
        @InjectRepository(MissedDTGOptimization, 'mssql')
        private readonly repository: Repository<MissedDTGOptimization>,
    ) {}

    async execute(query: GetMissedDTGQuery): Promise<any> {
        let missedProf = this.repository
            .createQueryBuilder('f')
            .select(
                `Facility_Name, SubCounty, County,SDP, Agency, CalHIV, CalHIVOnDTG, CalHIVNotOnDTG`,
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
            missedProf.andWhere('f.FacilityName IN (:...facility)', {
                facility: query.facility,
            });
        }

        if (query.partner) {
            missedProf.andWhere('f.PartnerName IN (:...partner)', {
                partner: query.partner,
            });
        }

        if (query.agency) {
            missedProf.andWhere('f.AgencyName IN (:...agency)', {
                agency: query.agency,
            });
        }

        if (query.emr) {
            missedProf.andWhere('f.Facilitytype IN (:...facilitytype)', {
                facilitytype: query.emr,
            });
        }

        if (query.datimAgeGroup) {
            missedProf.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        // if (query.year) {
        //     missedProf.andWhere(
        //         `YEAR(TRY_CONVERT(date, period + '-01')) = :year`,
        //         {
        //             year: query.year,
        //         },
        //     );
        // }

        // if (query.month) {
        //     missedProf.andWhere(
        //         `MONTH(TRY_CONVERT(date, period + '-01')) = :month`,
        //         {
        //             month: query.month,
        //         },
        //     );
        // }

        return await missedProf.getRawMany();
    }
}
