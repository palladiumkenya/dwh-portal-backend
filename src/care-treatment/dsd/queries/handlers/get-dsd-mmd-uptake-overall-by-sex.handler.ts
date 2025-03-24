import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdMmdUptake } from '../../entities/fact-trans-dsd-mmd-uptake.model';
import { Repository } from 'typeorm';
import { GetDsdMmdUptakeOverallBySexQuery } from '../impl/get-dsd-mmd-uptake-overall-by-sex.query';
import { AggregateDSD } from '../../entities/aggregate-dsd.model';

@QueryHandler(GetDsdMmdUptakeOverallBySexQuery)
export class GetDsdMmdUptakeOverallBySexHandler implements IQueryHandler<GetDsdMmdUptakeOverallBySexQuery> {
    constructor(
        @InjectRepository(AggregateDSD, 'mssql')
        private readonly repository: Repository<AggregateDSD>
    ) {

    }

    async execute(query: GetDsdMmdUptakeOverallBySexQuery): Promise<any> {
        const dsdMmdStable = this.repository.createQueryBuilder('f')
            .select(['Sex gender, SUM(TxCurr) txCurr, SUM(patients_onMMD) mmd, SUM(patients_nonMMD) nonMmd'])
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
            dsdMmdStable.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdMmdStable.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            dsdMmdStable.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            dsdMmdStable.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }


        return await dsdMmdStable.groupBy('f.Sex').getRawMany();
    }
}
