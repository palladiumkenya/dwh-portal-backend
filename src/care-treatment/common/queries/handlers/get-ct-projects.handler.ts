import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtProjectsQuery } from '../impl/get-ct-projects.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtProjectsQuery)
export class GetCtProjectsHandler implements IQueryHandler<GetCtProjectsQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {

    }

    async execute(query: GetCtProjectsQuery): Promise<any> {
        const projects = this.repository.createQueryBuilder('q')
            .select(['distinct q.County project'])
            .where('q.County IS NOT NULL');
        
        if (query.county) {
            projects.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            projects.andWhere('q.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        // if (query.facility) {
        //     projects.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        // }

        // if (query.partner) {
        //     projects.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        // }

        // if (query.agency) {
        //     projects.andWhere('q.agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     projects.andWhere('q.project IN (:...project)', { project: query.project });
        // }

        return await projects.orderBy('q.County').getRawMany();
    }
}
