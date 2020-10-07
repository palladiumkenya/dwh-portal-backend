import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdMmdStable } from '../../../../entities/care_treatment/fact-trans-dsd-mmd-stable.model';
import { Repository } from 'typeorm';
import { GetDsdMmdStableQuery } from '../get-dsd-mmd-stable.query';

@QueryHandler(GetDsdMmdStableQuery)
export class GetDsdMmdStableHandler implements IQueryHandler<GetDsdMmdStableQuery> {
    constructor(
        @InjectRepository(FactTransDsdMmdStable, 'mssql')
        private readonly repository: Repository<FactTransDsdMmdStable>
    ) {

    }

    async execute(query: GetDsdMmdStableQuery): Promise<any> {
        const dsdMmdStable = this.repository.createQueryBuilder('f')
            .select(['SUM([Differentiatedcare]) differentiatedCare, SUM([MMDModels]) mmdModels'])
            .where('f.[MFLCode] > 1');

        if (query.county) {
            dsdMmdStable.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            dsdMmdStable.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            dsdMmdStable.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            dsdMmdStable.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await dsdMmdStable.getRawOne();
    }
}
