import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdCascade } from '../../entities/fact-trans-dsd-cascade.model';
import { Repository } from 'typeorm';
import { GetDsdCascadeQuery } from '../impl/get-dsd-cascade.query';

@QueryHandler(GetDsdCascadeQuery)
export class GetDsdCascadeHandler implements IQueryHandler<GetDsdCascadeQuery> {
    constructor(
        @InjectRepository(FactTransDsdCascade, 'mssql')
        private readonly repository: Repository<FactTransDsdCascade>
    ) {

    }

    async execute(query: GetDsdCascadeQuery): Promise<any> {
        const dsdCascade = this.repository.createQueryBuilder('f')
            .select(['SUM([TXCurr]) txCurr, SUM([Stability]) stable, SUM([OnMMD]) mmd'])
            .where('f.[MFLCode] > 1');

        if (query.county) {
            dsdCascade.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdCascade.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdCascade.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdCascade.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await dsdCascade.getRawOne();
    }
}
