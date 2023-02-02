import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdMmdUptake } from '../../entities/fact-trans-dsd-mmd-uptake.model';
import { Repository } from 'typeorm';
import { GetDsdMmdUptakeOverallQuery } from '../impl/get-dsd-mmd-uptake-overall.query';
import { AggregateDSD } from '../../entities/aggregate-dsd.model';

@QueryHandler(GetDsdMmdUptakeOverallQuery)
export class GetDsdMmdUptakeOverallHandler implements IQueryHandler<GetDsdMmdUptakeOverallQuery> {
    constructor(
        @InjectRepository(AggregateDSD, 'mssql')
        private readonly repository: Repository<AggregateDSD>
    ) {

    }

    async execute(query: GetDsdMmdUptakeOverallQuery): Promise<any> {
        const dsdMmdStable = this.repository.createQueryBuilder('f')
            .select(['SUM(TxCurr) txCurr, SUM(patients_onMMD) mmd, SUM(patients_nonMMD) nonMmd'])
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

        if (query.agency) {
            dsdMmdStable.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            dsdMmdStable.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            dsdMmdStable.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdMmdStable.getRawOne();
    }
}
