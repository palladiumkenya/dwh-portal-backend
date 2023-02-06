import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidOverallAdmissionFemalesQuery } from '../impl/get-covid-overall-admission-females.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { GetCovidOverallAdmissionMalesQuery } from '../impl/get-covid-overall-admission-males.query';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidOverallAdmissionFemalesQuery)
export class GetCovidOverallAdmissionFemalesHandler implements IQueryHandler<GetCovidOverallAdmissionFemalesQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidOverallAdmissionFemalesQuery): Promise<any> {
        const covidOverallAdmissionFemales = this.repository
            .createQueryBuilder('f')
            .select([
                "AdmissionStatus, CASE WHEN AdmissionStatus='Yes' THEN 'Admitted' WHEN AdmissionStatus='No' THEN 'Not Admitted' ELSE 'Unclassified' END as Admission, count (*)Num",
            ])
            .where(
                "f.Gender in ('Female', 'F') and PatientStatus in ('Yes','Symptomatic')",
            );

        if (query.county) {
            covidOverallAdmissionFemales.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidOverallAdmissionFemales.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidOverallAdmissionFemales.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidOverallAdmissionFemales.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidOverallAdmissionFemales.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidOverallAdmissionFemales.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidOverallAdmissionFemales.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidOverallAdmissionFemales
            .groupBy('AdmissionStatus')
            .getRawMany();
    }
}
