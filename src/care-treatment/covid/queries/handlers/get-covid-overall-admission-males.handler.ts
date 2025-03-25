import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidOverallAdmissionMalesQuery } from '../impl/get-covid-overall-admission-males.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidOverallAdmissionMalesQuery)
export class GetCovidOverallAdmissionMalesHandler
    implements IQueryHandler<GetCovidOverallAdmissionMalesQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>,
    ) {}

    async execute(query: GetCovidOverallAdmissionMalesQuery): Promise<any> {
        const covidOverallAdmissionMales = this.repository
            .createQueryBuilder('f')
            .select([
                "AdmissionStatus, CASE WHEN AdmissionStatus='Yes' THEN 'Admitted' WHEN AdmissionStatus='No' THEN 'Not Admitted' ELSE 'Unclassified' END as Admission, count (*)Num",
            ])
            .where(
                "f.Sex IN ('Male', 'M') and PatientStatus in ('Yes','Symptomatic')",
            );

        if (query.county) {
            covidOverallAdmissionMales.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            covidOverallAdmissionMales.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            covidOverallAdmissionMales.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            covidOverallAdmissionMales.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            covidOverallAdmissionMales.andWhere(
                'f.AgencyName IN (:...agencies)',
                { agencies: query.agency },
            );
        }

        if (query.gender) {
            covidOverallAdmissionMales.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgeGroup) {
            covidOverallAdmissionMales.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await covidOverallAdmissionMales
            .groupBy('AdmissionStatus')
            .getRawMany();
    }
}
