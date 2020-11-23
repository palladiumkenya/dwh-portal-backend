import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsChildrenCascadeQuery } from '../impl/get-pns-children-cascade.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSChildren } from '../../entities/fact-pns-children.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetPnsChildrenCascadeQuery)
export class GetPnsChildrenCascadeHandler implements IQueryHandler<GetPnsChildrenCascadeQuery> {
    constructor(
        @InjectRepository(FactPNSChildren)
        private readonly repository: Repository<FactPNSChildren>
    ) {

    }

    async execute(query: GetPnsChildrenCascadeQuery): Promise<any> {
        const pnsChildrenCascade = this.repository.createQueryBuilder('q')
            .select(['SUM(q.ChildrenElicited) elicited, SUM(q.ChildTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
            .where('q.Mflcode IS NOT NULL');

        if(query.county) {
            pnsChildrenCascade.andWhere('q.County IN (:...counties)', { counties: query.county });
        }

        if(query.subCounty) {
            pnsChildrenCascade.andWhere('q.SubCounty IN (:...subCounties)', { subCounties: query.county });
        }

        if(query.facility) {
            pnsChildrenCascade.andWhere('q.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if(query.partner) {
            pnsChildrenCascade.andWhere('q.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if(query.month) {
            pnsChildrenCascade.andWhere('q.month = :month', { month: query.month });
        }

        if(query.year) {
            pnsChildrenCascade.andWhere('q.year = :year', { year: query.year});
        }

        return await pnsChildrenCascade.getRawOne();
    }
}
