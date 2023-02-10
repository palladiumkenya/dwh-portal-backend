import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVlUptakeAmongAlhivEnrolledInOtzByCountyQuery } from '../impl/get-vl-uptake-among-alhiv-enrolled-in-otz-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZ } from './../../entities/line-list-otz.model';

@QueryHandler(GetVlUptakeAmongAlhivEnrolledInOtzByCountyQuery)
export class GetVlUptakeAmongAlhivEnrolledInOtzByCountyHandler implements IQueryHandler<GetVlUptakeAmongAlhivEnrolledInOtzByCountyQuery> {
    constructor(
        @InjectRepository(LineListOTZ, 'mssql')
        private readonly repository: Repository<LineListOTZ>
    ) {
    }

    async execute(query: GetVlUptakeAmongAlhivEnrolledInOtzByCountyQuery): Promise<any> {
        const vlUptakeAmongAlHivEnrolledInOtzByCounty = this.repository.createQueryBuilder('f')
            .select(['[County], COUNT([lastVL]) lastVL, SUM([EligibleVL]) eligibleVL, COUNT([lastVL]) * 100.0/ SUM([EligibleVL]) as vl_uptake_percent'])
            ;

        if (query.county) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlUptakeAmongAlHivEnrolledInOtzByCounty
            .groupBy('County')
            .getRawMany();
    }
}
