import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidPercentageWhoMissedAppointmentsByPartnerQuery } from '../impl/get-covid-percentage-who-missed-appointments-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidPercentageWhoMissedAppointmentsByPartnerQuery)
export class GetCovidPercentageWhoMissedAppointmentsByPartnerHandler implements IQueryHandler<GetCovidPercentageWhoMissedAppointmentsByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidPercentageWhoMissedAppointmentsByPartnerQuery): Promise<any> {
        const covidPercentageWhoMissedAppointmentsByPartner = this.repository.createQueryBuilder('f')
            .select(['CTPartner, count (*)Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode = g.MFLCode and f.PatientPK = g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
            .where('MissedAppointmentDueToCOVID19=\'Yes\' AND CTPartner IS NOT NULL');

        if (query.county) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await covidPercentageWhoMissedAppointmentsByPartner
            .groupBy('CTPartner')
            .getRawMany();
    }
}
