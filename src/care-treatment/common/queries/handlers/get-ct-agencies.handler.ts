import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtAgenciesQuery } from '../impl/get-ct-agencies.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtAgenciesQuery)
export class GetCtAgenciesHandler implements IQueryHandler<GetCtAgenciesQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {

    }

    async execute(query: GetCtAgenciesQuery): Promise<any> {
        const agencies = this.repository.createQueryBuilder('q')
            .select(['distinct q.County agency'])
            .where('q.County IS NOT NULL');
        
        if (query.county) {
            agencies.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            agencies.andWhere('q.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        // if (query.facility) {
        //     agencies.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        // }

        // if (query.partner) {
        //     agencies.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        // }

        // if (query.agency) {
        //     agencies.andWhere('q.agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     agencies.andWhere('q.project IN (:...project)', { project: query.project });
        // }

        return await agencies.orderBy('q.County').getRawMany();
    }
}
