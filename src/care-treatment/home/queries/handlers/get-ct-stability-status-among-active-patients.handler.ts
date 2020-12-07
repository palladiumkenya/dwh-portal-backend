import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtStabilityStatusAmongActivePatientsQuery } from '../impl/get-ct-stability-status-among-active-patients.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransDsdCascade } from '../../entities/fact-trans-dsd-cascade.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtStabilityStatusAmongActivePatientsQuery)
export class GetCtStabilityStatusAmongActivePatientsHandler implements IQueryHandler<GetCtStabilityStatusAmongActivePatientsQuery> {
    constructor(
        @InjectRepository(FactTransDsdCascade, 'mssql')
        private readonly repository: Repository<FactTransDsdCascade>
    ) {
    }

    async execute(query: GetCtStabilityStatusAmongActivePatientsQuery): Promise<any> {
        const stabilityStatus = this.repository.createQueryBuilder('f')
            .select(['SUM([Stability]) Stable, SUM(([TXCurr]-[Stability])) Unstable'])
            .where('f.[TXCurr] IS NOT NULL');

        if (query.county) {
            stabilityStatus
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            stabilityStatus
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            stabilityStatus
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            stabilityStatus
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        /*if(query.month) {
            stabilityStatus.andWhere('f.StartART_Month = :month', { month: query.month });
        }

        if(query.year) {
            const dateVal = new Date();
            const yearVal = dateVal.getFullYear();

            if(query.year == yearVal) {
                stabilityStatus.andWhere('f.Start_Year >= :startYear', { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
            } else {
                stabilityStatus.andWhere('f.Start_Year = :startYear', { startYear: query.year });
            }
        }*/

        return await stabilityStatus
            .getRawOne();
    }
}
