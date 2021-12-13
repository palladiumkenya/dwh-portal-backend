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
            .select(['VaccinationStatus, f.CTPartner, Count (*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('g.ageLV >= 18 AND g.ARTOutcome = \'V\'');

        if (query.county) {
            adultPLHIVVaccinatedByPartner.andWhere('g.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            adultPLHIVVaccinatedByPartner.andWhere('g.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            adultPLHIVVaccinatedByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            adultPLHIVVaccinatedByPartner.andWhere('g.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            adultPLHIVVaccinatedByPartner.andWhere('g.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await adultPLHIVVaccinatedByPartner
            .groupBy('f.CTPartner,VaccinationStatus')
            .getRawMany();
    }
}
