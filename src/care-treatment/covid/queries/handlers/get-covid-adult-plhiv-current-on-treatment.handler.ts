import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPLHIVCurrentOnTreatmentQuery } from '../impl/get-covid-adult-plhiv-current-on-treatment.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinelistFACTART } from 'src/care-treatment/common/entities/linelist-fact-art.model';

@QueryHandler(GetCovidAdultPLHIVCurrentOnTreatmentQuery)
export class GetCovidAdultPLHIVCurrentOnTreatmentHandler
    implements IQueryHandler<GetCovidAdultPLHIVCurrentOnTreatmentQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(
        query: GetCovidAdultPLHIVCurrentOnTreatmentQuery,
    ): Promise<any> {
        const covidAdultsCurrentOnTreatment = this.repository
            .createQueryBuilder('f')
            .select(['Count (*) Adults'])
            .where(`age >= 12 and ArtOutcomeDescription = 'Active'`);

        if (query.county) {
            covidAdultsCurrentOnTreatment.andWhere(
                'f.County IN (:...counties)',
                { counties: query.county },
            );
        }

        if (query.subCounty) {
            covidAdultsCurrentOnTreatment.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            covidAdultsCurrentOnTreatment.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            covidAdultsCurrentOnTreatment.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            covidAdultsCurrentOnTreatment.andWhere(
                'f.AgencyName IN (:...agencies)',
                { agencies: query.agency },
            );
        }

        if (query.gender) {
            covidAdultsCurrentOnTreatment.andWhere(
                'f.Gender IN (:...genders)',
                { genders: query.gender },
            );
        }

        if (query.datimAgeGroup) {
            covidAdultsCurrentOnTreatment.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await covidAdultsCurrentOnTreatment.getRawOne();
    }
}
