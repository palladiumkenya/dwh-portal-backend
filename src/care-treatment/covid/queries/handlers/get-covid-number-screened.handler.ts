import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidNumberScreenedQuery } from '../impl/get-covid-number-screened.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { LineListCovid } from '../../entities/linelist-covid.model';
//Margaret
@QueryHandler(GetCovidNumberScreenedQuery)
export class GetCovidNumberScreenedHandler implements IQueryHandler<GetCovidNumberScreenedQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidNumberScreenedQuery): Promise<any> {
        const numberScreened = this.repository.createQueryBuilder('f')
            .select(['count (*)Screened'])
            
            .where('f.VaccinationStatus in (\'Fully Vaccinated\',\'Not Vaccinated\',\'Partially Vaccinated\')');

        if (query.county) {
            numberScreened.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            numberScreened.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            numberScreened.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            numberScreened.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            numberScreened.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            numberScreened.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            numberScreened.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await numberScreened.getRawOne();
    }
}
