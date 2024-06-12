import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcOverallOvcServQuery } from '../impl/get-ovc-overall-ovc-serv.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcOverallOvcServQuery)
export class GetOvcOverallOvcServHandler implements IQueryHandler<GetOvcOverallOvcServQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcOverallOvcServQuery): Promise<any> {
        const overOvcServ = this.repository.createQueryBuilder('f')
            .select(['COUNT(*) overallOvcServ'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and TXCurr=1');

        if (query.county) {
            overOvcServ.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            overOvcServ.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            overOvcServ.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            overOvcServ.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            overOvcServ.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            overOvcServ.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            overOvcServ.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await overOvcServ.getRawOne();
    }
}
