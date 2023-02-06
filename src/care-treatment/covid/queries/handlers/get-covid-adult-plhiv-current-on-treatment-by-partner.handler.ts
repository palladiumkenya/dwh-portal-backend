import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivCurrentOnTreatmentByPartnerQuery } from '../impl/get-covid-adult-plhiv-current-on-treatment-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidAdultPlhivCurrentOnTreatmentByPartnerQuery)
export class GetCovidAdultPLHIVCurrentOnTreatmentByPartnerHandler implements IQueryHandler<GetCovidAdultPlhivCurrentOnTreatmentByPartnerQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidAdultPlhivCurrentOnTreatmentByPartnerQuery): Promise<any> {
        const covidAdultsCurrentOnTreatmentByPartner = this.repository.createQueryBuilder('f')
            .select(['Count (*) Adults, CTPartner']);

        if (query.county) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidAdultsCurrentOnTreatmentByPartner.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }


        return await covidAdultsCurrentOnTreatmentByPartner
            .groupBy('CTPartner')
            .getRawMany();
    }
}
