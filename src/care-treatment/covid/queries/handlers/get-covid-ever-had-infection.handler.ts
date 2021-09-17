import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCovidEverHadInfectionQuery } from '../impl/get-covid-ever-had-infection.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransCovidVaccines } from '../../entities/fact-trans-covid-vaccines.model';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCovidEverHadInfectionQuery)
export class GetCovidEverHadInfectionHandler implements IQueryHandler<GetCovidEverHadInfectionQuery> {
    constructor(
        @InjectRepository(FactTransCovidVaccines, 'mssql')
        private readonly repository: Repository<FactTransCovidVaccines>
    ) {
    }

    async execute(query: GetCovidEverHadInfectionQuery): Promise<any> {
        const everHadCovidInfection = this.repository.createQueryBuilder('f')
            .select(['count(*) Num'])
            .leftJoin(FactTransNewCohort, 'g', 'f.PatientID = g.PatientID and f.SiteCode=g.MFLCode and f.PatientPK=g.PatientPK')
            .innerJoin(DimAgeGroups, 'v', 'g.ageLV = v.Age')
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
            everHadCovidInfection.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await everHadCovidInfection.getRawOne();
    }
}
