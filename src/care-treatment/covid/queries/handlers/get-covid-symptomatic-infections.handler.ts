import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidSymptomaticInfectionsQuery } from '../impl/get-covid-symptomatic-infections.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidSymptomaticInfectionsQuery)
export class GetCovidSymptomaticInfectionsHandler implements IQueryHandler<GetCovidSymptomaticInfectionsQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidSymptomaticInfectionsQuery): Promise<any> {
        const covidSymptomaticInfections = this.repository.createQueryBuilder('f')
            .select(['count(*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('EverCOVID19Positive=\'Yes\' and PatientStatus=\'Yes\'');

        if (query.county) {
            covidSymptomaticInfections.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidSymptomaticInfections.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidSymptomaticInfections.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidSymptomaticInfections.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidSymptomaticInfections.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidSymptomaticInfections.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidSymptomaticInfections.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidSymptomaticInfections.getRawOne();
    }
}
