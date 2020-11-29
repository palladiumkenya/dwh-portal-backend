import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsPartnersQuery } from '../impl/get-hts-partners.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetHtsPartnersQuery)
export class GetHtsPartnersHandler implements IQueryHandler<GetHtsPartnersQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {
        
    }

    async execute(query: GetHtsPartnersQuery): Promise<any> {
        const params = [];
        let partnersSql = `SELECT DISTINCT \`CTPartner\` AS \`partner\` FROM \`fact_htsuptake\` WHERE \`CTPartner\` IS NOT NULL `;

        if(query.county) {
            partnersSql = `${partnersSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            partnersSql = `${partnersSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            partnersSql = `${partnersSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            partnersSql = `${partnersSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        // if(query.agency) {
        //     partnersSql = `${partnersSql} and Agency IN (?)`;
        //     params.push(query.agency);
        // }

        // if(query.project) {
        //     partnersSql = `${partnersSql} and Project IN (?)`;
        //     params.push(query.project);
        // }

        partnersSql = `${partnersSql} ORDER BY CTPartner ASC`;

        return  await this.repository.query(partnersSql, params);
    }
}
