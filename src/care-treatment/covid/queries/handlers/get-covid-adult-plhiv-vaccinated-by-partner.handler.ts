import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidAdultPlhivVaccinatedByPartnerQuery } from '../impl/get-covid-adult-plhiv-vaccinated-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidAdultPlhivVaccinatedByPartnerQuery)
export class GetCovidAdultPLHIVVaccinatedByPartnerHandler implements IQueryHandler<GetCovidAdultPlhivVaccinatedByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidAdultPlhivVaccinatedByPartnerQuery): Promise<any> {
        const adultPLHIVVaccinatedByPartner = this.repository.createQueryBuilder('f')
            .select(['VaccinationStatus, CTPartner, Count (*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('g.ageLV >= 18');

        if (query.county) {
            adultPLHIVVaccinatedByPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await adultPLHIVVaccinatedByPartner
            .groupBy('CTPartner,VaccinationStatus')
            .getRawMany();
    }
}
