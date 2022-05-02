import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {GetCovidManagementAdmittedInHospitalQuery} from "../impl/get-covid-management-admitted-in-hospital.query";
import {InjectRepository} from "@nestjs/typeorm";
import {FactTransCovidVaccines} from "../../entities/fact-trans-covid-vaccines.model";
import {Repository} from "typeorm";
import {FactTransNewCohort} from "../../../new-on-art/entities/fact-trans-new-cohort.model";
import {DimAgeGroups} from "../../../common/entities/dim-age-groups.model";

@QueryHandler(GetCovidManagementAdmittedInHospitalQuery)
export class GetCovidManagementAdmittedHandler implements IQueryHandler<GetCovidManagementAdmittedInHospitalQuery>{
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetCovidManagementAdmittedInHospitalQuery): Promise<any> {
        const covidManagementAdmitted = this.repository.createQueryBuilder('g')
            .select([' Case When AdmissionUnit=\'\' Then \'Other\' Else AdmissionUnit end as AdmissionUnit, count (*)Num'])
            .leftJoin(FactTransCovidVaccines, 'f', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('PatientStatus=\'Yes\'');


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
            covidManagementAdmitted.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidManagementAdmitted
            .groupBy('AdmissionUnit')
            .orderBy('Num', 'DESC')
            .getRawMany();
    }

}