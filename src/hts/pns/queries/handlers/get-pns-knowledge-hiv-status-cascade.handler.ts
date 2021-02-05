import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsKnowledgeHivStatusCascadeQuery } from '../impl/get-pns-knowledge-hiv-status-cascade.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSKnowledgeHivStatus } from '../../entities/fact-pns-knowledge-hiv-status.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetPnsKnowledgeHivStatusCascadeQuery)
export class GetPnsKnowledgeHivStatusCascadeHandler implements IQueryHandler<GetPnsKnowledgeHivStatusCascadeQuery> {
    constructor(
        @InjectRepository(FactPNSKnowledgeHivStatus)
        private readonly repository: Repository<FactPNSKnowledgeHivStatus>
    ) {

    }

    async execute(query: GetPnsKnowledgeHivStatusCascadeQuery): Promise<any> {
        const pnsKnowledgeHivStatusCascade = this.repository.createQueryBuilder('q')
            .select(['SUM(q.ContactElicited) elicited, SUM(q.ContactTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive, SUM(q.NewNegatives) newNegatives, SUM(q.NewPositives) newPositives, SUM(q.UnknownStatus) unknownStatus'])
            .where('q.Mflcode IS NOT NULL');

        if(query.county) {
            pnsKnowledgeHivStatusCascade.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if(query.subCounty) {
            pnsKnowledgeHivStatusCascade.andWhere('q.subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if(query.facility) {
            pnsKnowledgeHivStatusCascade.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if(query.partner) {
            pnsKnowledgeHivStatusCascade.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if(query.agency) {
        //     pnsKnowledgeHivStatusCascade.andWhere('q.agency IN (:...agency)', { agency: query.agency });
        // }

        if(query.project) {
            pnsKnowledgeHivStatusCascade.andWhere('q.project IN (:...project)', { project: query.project });
        }

        if(query.month) {
            pnsKnowledgeHivStatusCascade.andWhere('q.month = :month', { month: query.month });
        }

        if(query.year) {
            pnsKnowledgeHivStatusCascade.andWhere('q.year = :year', { year: query.year});
        }

        return await pnsKnowledgeHivStatusCascade.getRawOne();
    }
}
