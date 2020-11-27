import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { GetProjectsQuery } from '../impl/get-projects.query';

@QueryHandler(GetProjectsQuery)
export class GetProjectsHandler implements IQueryHandler<GetProjectsQuery> {
    constructor(
        @InjectRepository(FactPNSSexualPartner)
        private readonly repository: Repository<FactPNSSexualPartner>,
    ) {

    }

    async execute(query: GetProjectsQuery): Promise<any> {
        const projects = this.repository.createQueryBuilder('q')
            .select('q.Project', 'project')
            .where('q.Project IS NOT NULL');

        if (query.county) {
            projects.andWhere('q.County IN (:...county)', { county: [query.county] });
        }

        if (query.subCounty) {
            projects.andWhere('q.SubCounty IN (:...subCounty)', { subCounty: [query.subCounty] });
        }

        if (query.facility) {
            projects.andWhere('q.FacilityName IN (:...facility)', { facility: [query.facility] });
        }

        if (query.partner) {
            projects.andWhere('q.CTPartner IN (:...partner)', { partner: [query.partner] });
        }

        // if (query.agency) {
        //     projects.andWhere('q.agency IN (:...agency)', { agency: [query.agency] });
        // }

        if (query.project) {
            projects.andWhere('q.Project IN (:...project)', { project: [query.project] });
        }

        return await projects.orderBy('q.Project').distinct(true).getRawMany();
    }
}
