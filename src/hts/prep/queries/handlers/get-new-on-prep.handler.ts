import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetNewOnPrepQuery } from '../impl/get-new-on-prep.query';
import { FactPrep } from '../../entities/fact-prep.model';

@QueryHandler(GetNewOnPrepQuery)
export class GetNewOnPrepHandler implements IQueryHandler<GetNewOnPrepQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetNewOnPrepQuery): Promise<any> {
        let medianTimeToARTPartnerSql = this.repository
            .createQueryBuilder('f')
            .select([
                'Sitecode, FacilityName, County, SubCounty, CTPartner, CTAgency, VisitMonth, VisitYear, Count (distinct (concat(PrepNumber,PatientPk,SiteCode))) As StartedPrep',
            ])
            .where(
                'PrepEnrollmentDate is not null and  VisitDate <> PrepEnrollmentDate',
            );

        if (query.county) {
            medianTimeToARTPartnerSql.andWhere(
                'f.County IN (:...counties)',
                {
                    counties: query.county,
                }
            );
        }

        if (query.subCounty) {
            medianTimeToARTPartnerSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                {
                    subCounties: query.subCounty,
                },
            );
        }

        if (query.partner) {
            medianTimeToARTPartnerSql.andWhere(
                'f.CTPartner IN (:...partners)',
                {
                    partners: query.partner,
                },
            );
        }

        if (query.agency) {
            medianTimeToARTPartnerSql.andWhere(
                'f.CTAgency IN (:...agencies)',
                {
                    agencies: query.agency,
                }
            );
        }

        if (query.gender) {
            medianTimeToARTPartnerSql.andWhere(
                'f.Gender IN (:...genders)', 
                {
                    genders: query.gender,
                }
            );
        }

        if (query.datimAgeGroup) {
            medianTimeToARTPartnerSql.andWhere(
                'f.AgeGroup IN (:...ageGroups)', 
                {
                    ageGroups: query.datimAgeGroup,
                }
            );
        }

        return await medianTimeToARTPartnerSql
            .groupBy('Sitecode, FacilityName, County, SubCounty, CTPartner, CTAgency, DATENAME (Month,VisitMonth) As VisitMonth, VisitYear')
            .getRawMany();
    }
}
