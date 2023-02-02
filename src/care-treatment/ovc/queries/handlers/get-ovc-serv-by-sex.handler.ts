import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcServBySexQuery } from '../impl/get-ovc-serv-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcServBySexQuery)
export class GetOvcServBySexHandler implements IQueryHandler<GetOvcServBySexQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcServBySexQuery): Promise<any> {
        const ovcServBySex = this.repository.createQueryBuilder('f')
            .select(['COUNT(*) overallOvcServ, Gender'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and TXCurr=1');

        if (query.county) {
            ovcServBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            ovcServBySex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            ovcServBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            ovcServBySex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            ovcServBySex.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            ovcServBySex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            ovcServBySex.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await ovcServBySex
            .groupBy('Gender')
            .getRawMany();
    }
}
