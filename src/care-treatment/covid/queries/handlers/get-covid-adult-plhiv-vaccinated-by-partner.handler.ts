import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivVaccinatedByPartnerQuery } from '../impl/get-covid-adult-plhiv-vaccinated-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import {LineListCovid} from "../../entities/linelist-covid.model";
//MARY  -- done
@QueryHandler(GetCovidAdultPlhivVaccinatedByPartnerQuery)
export class GetCovidAdultPLHIVVaccinatedByPartnerHandler implements IQueryHandler<GetCovidAdultPlhivVaccinatedByPartnerQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidAdultPlhivVaccinatedByPartnerQuery): Promise<any> {
        const adultPLHIVVaccinatedByPartner = this.repository.createQueryBuilder('g')
            .select(['g.VaccinationStatus, g.CTPartner, Count (*) Num'])
            .where('g.TracingFinalOutcome = \'V\'');

        if (query.county) {
            adultPLHIVVaccinatedByPartner.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByPartner.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByPartner.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByPartner.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultPLHIVVaccinatedByPartner.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            adultPLHIVVaccinatedByPartner.andWhere('Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.ageGroup) {
            adultPLHIVVaccinatedByPartner.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.ageGroup });
        }

        return await adultPLHIVVaccinatedByPartner
            .groupBy('g.CTPartner,g.VaccinationStatus')
            .getRawMany();
    }
}
