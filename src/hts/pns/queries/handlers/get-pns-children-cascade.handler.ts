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
            pnsChildrenCascade.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if(query.subCounty) {
            pnsChildrenCascade.andWhere('q.SubCounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if(query.facility) {
            pnsChildrenCascade.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if(query.partner) {
            pnsChildrenCascade.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if(query.month) {
        //     pnsChildrenCascade.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsChildrenCascade.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsChildrenCascade.andWhere( `CONCAT(year, LPAD(month, 2, '0'))>= :fromDate`, {fromDate: query.fromDate});
        }

        if (query.toDate) {
            pnsChildrenCascade.andWhere(`CONCAT(year, LPAD(month, 2, '0'))<= :toDate`, { toDate: query.toDate });
        }

        return await pnsChildrenCascade.getRawOne();
    }
}
