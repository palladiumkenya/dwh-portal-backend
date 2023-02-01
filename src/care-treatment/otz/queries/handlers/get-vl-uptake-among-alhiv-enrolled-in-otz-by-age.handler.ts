import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVlUptakeAmongAlhivEnrolledInOtzByAgeQuery } from '../impl/get-vl-uptake-among-alhiv-enrolled-in-otz-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZ } from './../../entities/line-list-otz.model';

@QueryHandler(GetVlUptakeAmongAlhivEnrolledInOtzByAgeQuery)
export class GetVlUptakeAmongAlhivEnrolledInOtzByAgeHandler implements IQueryHandler<GetVlUptakeAmongAlhivEnrolledInOtzByAgeQuery> {
    constructor(
        @InjectRepository(LineListOTZ, 'mssql')
        private readonly repository: Repository<LineListOTZ>
    ) {
    }

    async execute(query: GetVlUptakeAmongAlhivEnrolledInOtzByAgeQuery): Promise<any> {
        const vlUptakeAmongAlHivEnrolledInOtzByAge = this.repository.createQueryBuilder('f')
            .select(['[AgeGroup] ageGroup, COUNT([lastVL]) lastVL, SUM([EligibleVL]) eligibleVL, COUNT([lastVL]) * 100.0/ SUM([EligibleVL]) as vl_uptake_percent'])
            ;

        if (query.county) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlUptakeAmongAlHivEnrolledInOtzByAge
            .groupBy('AgeGroup')
            .getRawMany();
    }
}
