import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtFacilitiesQuery } from '../impl/get-ct-facilities.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtFacilitiesQuery)
export class GetCtFacilitiesHandler implements IQueryHandler<GetCtFacilitiesQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {

    }

    async execute(query: GetCtFacilitiesQuery): Promise<any> {
        const facilities = this.repository.createQueryBuilder('q')
            .select(['distinct FacilityName facility'])
            .where('q.FacilityName IS NOT NULL');

        if (query.county) {
            facilities.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            facilities.andWhere('q.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            facilities.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            facilities.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if (query.agency) {
        //     facilities.andWhere('q.agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     facilities.andWhere('q.project IN (:...project)', { project: query.project });
        // }

        return await facilities.orderBy('q.FacilityName').getRawMany();
    }
}
