import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdMmdActivePatients } from '../../entities/fact-trans-dsd-mmd-active-patients.model';
import { Repository } from 'typeorm';
import { GetDsdMmdStableQuery } from '../impl/get-dsd-mmd-stable.query';

@QueryHandler(GetDsdMmdStableQuery)
export class GetDsdMmdStableHandler implements IQueryHandler<GetDsdMmdStableQuery> {
    constructor(
        @InjectRepository(FactTransDsdMmdActivePatients, 'mssql')
        private readonly repository: Repository<FactTransDsdMmdActivePatients>
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
            dsdMmdStable.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            dsdMmdStable.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            dsdMmdStable.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            dsdMmdStable.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await dsdMmdStable
            .groupBy('f.[DifferentiatedCare]')
            .getRawMany();
    }
}
