import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdMmdActivePatients } from '../../entities/fact-trans-dsd-mmd-active-patients.model';
import { Repository } from 'typeorm';
import { GetDsdMmdStableQuery } from '../impl/get-dsd-mmd-stable.query';
import { AggregateDSDStable } from '../../entities/aggregate-dsd-stable.model';

@QueryHandler(GetDsdMmdStableQuery)
export class GetDsdMmdStableHandler implements IQueryHandler<GetDsdMmdStableQuery> {
    constructor(
        @InjectRepository(AggregateDSDStable, 'mssql')
        private readonly repository: Repository<AggregateDSDStable>
    ) {

    }

    async execute(query: GetDsdMmdStableQuery): Promise<any> {
        const dsdMmdStable = this.repository.createQueryBuilder('f')
            .select(['f.[DifferentiatedCare] differentiatedCare, SUM(f.MMDModels) mmdModels, SUM(f.TXCurr) * 100.0 / SUM(SUM(f.TXCurr)) OVER () AS Percentage'])
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
            dsdMmdStable.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdMmdStable.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            dsdMmdStable.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            dsdMmdStable.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdMmdStable
            .groupBy('f.[DifferentiatedCare]')
            .getRawMany();
    }
}
