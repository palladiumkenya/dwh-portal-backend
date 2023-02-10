import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetCovidManagementAdmittedInHospitalQuery} from "../impl/get-covid-management-admitted-in-hospital.query";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidManagementAdmittedInHospitalQuery)
export class GetCovidManagementAdmittedHandler implements IQueryHandler<GetCovidManagementAdmittedInHospitalQuery>{
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidManagementAdmittedInHospitalQuery): Promise<any> {
        const covidManagementAdmitted = this.repository
            .createQueryBuilder('g')
            .select([
                " Case When AdmissionUnit='' Then 'Other' Else AdmissionUnit end as AdmissionUnit, count (*) Num",
            ])
            .where("PatientStatus in ('Yes','Symptomatic')")
            .andWhere("AdmissionStatus='Yes'");


        if (query.county) {
            covidManagementAdmitted.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidManagementAdmitted.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidManagementAdmitted.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidManagementAdmitted.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidManagementAdmitted.andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidManagementAdmitted.andWhere('Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidManagementAdmitted.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidManagementAdmitted
            .groupBy('AdmissionUnit')
            .orderBy('Num', 'DESC')
            .getRawMany();
    }

}