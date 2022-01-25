import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidPlhivCurrentOnArtQuery } from '../impl/get-covid-plhiv-current-on-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCovidPlhivCurrentOnArtQuery)
export class GetCovidPLHIVCurrentOnArtHandler implements IQueryHandler<GetCovidPlhivCurrentOnArtQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetCovidPlhivCurrentOnArtQuery): Promise<any> {
        const covidPLHIVCurrentOnART = this.repository.createQueryBuilder('f')
            .select(['Count (*) Adults, Gender'])
            .where('f.ARTOutcome=\'V\'');

        if (query.county) {
            covidPLHIVCurrentOnART.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidPLHIVCurrentOnART.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidPLHIVCurrentOnART.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidPLHIVCurrentOnART.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidPLHIVCurrentOnART.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidPLHIVCurrentOnART.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            // lacking age group
            // covidPLHIVCurrentOnART.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }


        return await covidPLHIVCurrentOnART
            .groupBy('Gender')
            .getRawMany();
    }
}
