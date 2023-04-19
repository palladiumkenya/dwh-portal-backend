import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissedTestingFirstANC } from '../../entities/missed-testing-first-anc.model';
import { GetMissedANCBySDPQuery } from '../impl/get-missed-anc-by-sdp.query';

@QueryHandler(GetMissedANCBySDPQuery)
export class GetMissedANCBySDPHandler
    implements IQueryHandler<GetMissedANCBySDPQuery> {
    constructor(
        @InjectRepository(MissedTestingFirstANC, 'mssql')
        private readonly repository: Repository<MissedTestingFirstANC>,
    ) {}

    async execute(query: GetMissedANCBySDPQuery): Promise<any> {
        let missedANC = this.repository
            .createQueryBuilder('f')
            .select(
                `SUM(NoOfMothersHIVTested) HIVTested, SUM(NoOfMothers) FirstANC, SUM(NoOfMothersSyphillisTested) SyphilisTested, SDP`,
            );

        if (query.county) {
            missedANC.andWhere('f.County IN (:...county)', {
                county: query.county,
            });
        }

        if (query.subCounty) {
            missedANC.andWhere('f.Subcounty IN (:...subCounty)', {
                subCounty: query.subCounty,
            });
        }

        if (query.facility) {
            missedANC.andWhere('f.Facility_Name IN (:...facility)', {
                facility: query.facility,
            });
        }

        if (query.partner) {
            missedANC.andWhere('f.SDP IN (:...partner)', {
                partner: query.partner,
            });
        }

        if (query.agency) {
            missedANC.andWhere('f.Agency IN (:...agency)', {
                agency: query.agency,
            });
        }

        if (query.emr) {
            missedANC.andWhere('f.Facilitytype IN (:...facilitytype)', {
                facilitytype: query.emr,
            });
        }

        if (query.year) {
            missedANC.andWhere(
                `YEAR(TRY_CONVERT(date, YearMonth + '-01')) = :year`,
                {
                    year: query.year,
                },
            );
        }

        if (query.month) {
            missedANC.andWhere(
                `MONTH(TRY_CONVERT(date, YearMonth + '-01')) = :month`,
                {
                    month: query.month,
                },
            );
        }

        return await missedANC
            .groupBy('SDP')
            .orderBy('SUM(NoOfMothers)', 'DESC')
            .getRawMany();
    }
}
