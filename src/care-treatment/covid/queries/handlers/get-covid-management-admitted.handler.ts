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
            covidManagementAdmitted.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidManagementAdmitted.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidManagementAdmitted.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidManagementAdmitted.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidManagementAdmitted.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidManagementAdmitted.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidManagementAdmitted.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidManagementAdmitted
            .groupBy('AdmissionUnit')
            .orderBy('Num', 'DESC')
            .getRawMany();
    }

}