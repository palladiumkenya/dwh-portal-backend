import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidEverHadInfectionQuery } from '../impl/get-covid-ever-had-infection.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import {AggregateCovid} from "../../entities/aggregate-covid.model";
import {LineListCovid} from "../../entities/linelist-covid.model";
//MARY- done
@QueryHandler(GetCovidEverHadInfectionQuery)
export class GetCovidEverHadInfectionHandler implements IQueryHandler<GetCovidEverHadInfectionQuery> {
    constructor(
        @InjectRepository(LineListCovid, 'mssql')
        private readonly repository: Repository<LineListCovid>
    ) {
    }

    async execute(query: GetCovidEverHadInfectionQuery): Promise<any> {
        const everHadCovidInfection = this.repository.createQueryBuilder('f')
            .select(['count(*) Num'])           
            .where('EverCOVID19Positive=\'Yes\'');

        if (query.county) {
            everHadCovidInfection.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            everHadCovidInfection.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            everHadCovidInfection.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            everHadCovidInfection.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            everHadCovidInfection.andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            everHadCovidInfection.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.ageGroup) {
            everHadCovidInfection.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.ageGroup });
        }

        return await everHadCovidInfection.getRawOne();
    }
}
