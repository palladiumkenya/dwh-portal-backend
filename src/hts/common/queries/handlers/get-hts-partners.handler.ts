import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsPartnersQuery } from '../impl/get-hts-partners.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { AllEmrSites } from 'src/care-treatment/common/entities/all-emr-sites.model';

@QueryHandler(GetHtsPartnersQuery)
export class GetHtsPartnersHandler
    implements IQueryHandler<GetHtsPartnersQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetHtsPartnersQuery): Promise<any> {
        const params = [];
        let partnersSql = `SELECT DISTINCT PartnerName AS partner FROM all_EMRSites WHERE PartnerName IS NOT NULL and isHTS = 1`;

        if (query.county) {
            partnersSql = `${partnersSql} and County IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            partnersSql = `${partnersSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        // if(query.facility) {
        //     partnersSql = `${partnersSql} and FacilityName IN (?)`;
        //     params.push(query.facility);
        // }

        // if(query.partner) {
        //     partnersSql = `${partnersSql} and CTPartner IN (?)`;
        //     params.push(query.partner);
        // }

        // if(query.agency) {
        //     partnersSql = `${partnersSql} and Agency IN (?)`;
        //     params.push(query.agency);
        // }

        // if(query.project) {
        //     partnersSql = `${partnersSql} and Project IN (?)`;
        //     params.push(query.project);
        // }

        partnersSql = `${partnersSql} ORDER BY PartnerName ASC`;

        return await this.repository.query(partnersSql, params);
    }
}
