import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidOverallAdmissionQuery } from '../impl/get-covid-overall-admission.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidOverallAdmissionQuery)
export class GetCovidOverallAdmissionHandler
    implements IQueryHandler<GetCovidOverallAdmissionQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>,
    ) {}

    async execute(query: GetCovidOverallAdmissionQuery): Promise<any> {
        const covidOverallAdmission = this.repository
            .createQueryBuilder('f')
            .select([
                "AdmissionStatus, CASE WHEN AdmissionStatus='Yes' THEN 'Admitted' WHEN AdmissionStatus='No' THEN 'Not Admitted' ELSE 'Unclassified' END as Admission, count (*)Num",
            ])
            .where("PatientStatus in ('Yes','Symptomatic')");

        if (query.county) {
            covidOverallAdmission.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            covidOverallAdmission.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            covidOverallAdmission.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            covidOverallAdmission.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            covidOverallAdmission.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.gender) {
            covidOverallAdmission.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgeGroup) {
            covidOverallAdmission.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await covidOverallAdmission
            .groupBy('AdmissionStatus')
            .getRawMany();
    }
}
