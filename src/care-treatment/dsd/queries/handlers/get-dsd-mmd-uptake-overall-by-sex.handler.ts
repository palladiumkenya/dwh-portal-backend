import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdMmdUptake } from '../../entities/fact-trans-dsd-mmd-uptake.model';
import { Repository } from 'typeorm';
import { GetDsdMmdUptakeOverallBySexQuery } from '../impl/get-dsd-mmd-uptake-overall-by-sex.query';

@QueryHandler(GetDsdMmdUptakeOverallBySexQuery)
export class GetDsdMmdUptakeOverallBySexHandler implements IQueryHandler<GetDsdMmdUptakeOverallBySexQuery> {
    constructor(
        @InjectRepository(FactTransDsdMmdUptake, 'mssql')
        private readonly repository: Repository<FactTransDsdMmdUptake>
    ) {

    }

    async execute(query: GetDsdMmdUptakeOverallBySexQuery): Promise<any> {
        const dsdMmdStable = this.repository.createQueryBuilder('f')
            .select(['Gender gender, SUM(TxCurr) txCurr, SUM(MMD) mmd, SUM(NonMMD) nonMmd'])
            .where('f.MFLCode > 1');

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

        return await dsdMmdStable.groupBy('f.Gender').getRawMany();
    }
}
