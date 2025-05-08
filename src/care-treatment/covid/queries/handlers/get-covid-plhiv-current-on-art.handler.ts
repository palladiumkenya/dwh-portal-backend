import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidPlhivCurrentOnArtQuery } from '../impl/get-covid-plhiv-current-on-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidPlhivCurrentOnArtQuery)
export class GetCovidPLHIVCurrentOnArtHandler implements IQueryHandler<GetCovidPlhivCurrentOnArtQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidPlhivCurrentOnArtQuery): Promise<any> {
        const covidPLHIVCurrentOnART = this.repository.createQueryBuilder('f')
            .select(['Count (*) Adults, Sex Gender'])

        if (query.county) {
            covidPLHIVCurrentOnART.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidPLHIVCurrentOnART.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidPLHIVCurrentOnART.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidPLHIVCurrentOnART.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidPLHIVCurrentOnART.andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidPLHIVCurrentOnART.andWhere('Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidPLHIVCurrentOnART.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }


        return await covidPLHIVCurrentOnART
            .groupBy('Sex')
            .getRawMany();
    }
}
