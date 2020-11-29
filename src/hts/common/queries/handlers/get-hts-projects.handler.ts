import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsProjectsQuery } from '../impl/get-hts-projects.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetHtsProjectsQuery)
export class GetHtsProjectsHandler implements IQueryHandler<GetHtsProjectsQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {
        
    }

    async execute(query: GetHtsProjectsQuery): Promise<any> {
        const params = [];
        let projectsSql = `SELECT DISTINCT \`Project\` AS \`project\` FROM \`fact_pns_sexualpartner\` WHERE \`Project\` IS NOT NULL `;

        if(query.county) {
            projectsSql = `${projectsSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            projectsSql = `${projectsSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            projectsSql = `${projectsSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            projectsSql = `${projectsSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        // if(query.agency) {
        //     projectsSql = `${projectsSql} and Agency IN (?)`;
        //     params.push(query.agency);
        // }

        if(query.project) {
            projectsSql = `${projectsSql} and Project IN (?)`;
            params.push(query.project);
        }

        projectsSql = `${projectsSql} ORDER BY Project ASC`;

        return  await this.repository.query(projectsSql, params);
    }
}
