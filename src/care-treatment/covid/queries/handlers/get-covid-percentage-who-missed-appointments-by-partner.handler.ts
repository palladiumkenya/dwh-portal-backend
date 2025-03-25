import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidPercentageWhoMissedAppointmentsByPartnerQuery } from '../impl/get-covid-percentage-who-missed-appointments-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import { LineListCovid } from './../../entities/linelist-covid.model';

@QueryHandler(GetCovidPercentageWhoMissedAppointmentsByPartnerQuery)
export class GetCovidPercentageWhoMissedAppointmentsByPartnerHandler implements IQueryHandler<GetCovidPercentageWhoMissedAppointmentsByPartnerQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidPercentageWhoMissedAppointmentsByPartnerQuery): Promise<any> {
        const covidPercentageWhoMissedAppointmentsByPartner = this.repository.createQueryBuilder('f')
            .select(['PartnerName CTPartner, count (*)Num'])
            .where('MissedAppointmentDueToCOVID19=\'Yes\' AND PartnerName IS NOT NULL');

        if (query.county) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            covidPercentageWhoMissedAppointmentsByPartner.andWhere('AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await covidPercentageWhoMissedAppointmentsByPartner
            .groupBy('PartnerName')
            .getRawMany();
    }
}
