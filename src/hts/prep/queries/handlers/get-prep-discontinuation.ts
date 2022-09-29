import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPrep } from '../../entities/fact-prep.model';
import { GetPrepDiscontinuationQuery } from './../impl/get-prep-discontinuation.query';

@QueryHandler(GetPrepDiscontinuationQuery)
export class GetPrepDiscontinuationHandler
    implements IQueryHandler<GetPrepDiscontinuationQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetPrepDiscontinuationQuery): Promise<any> {
        let medianTimeToARTPartnerSql = this.repository
            .createQueryBuilder('f')
            .select([
                'Sitecode, FacilityName, County, SubCounty, CTPartner, CTAgency, Datepart (month,ExitDate) As ExitMonth, Datepart (year,ExitDate) As ExitYear, Count (distinct (concat(PrepNumber,PatientPk,SiteCode))) As PrepDiscontinuations',
            ])
            .where(
                'ExitDate is not null and  DATEDIFF(month, ExitDate, GETDATE()) = 1',
            );

        if (query.county) {
            medianTimeToARTPartnerSql.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
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
            medianTimeToARTPartnerSql.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.gender) {
            medianTimeToARTPartnerSql.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgeGroup) {
            medianTimeToARTPartnerSql.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                {
                    ageGroups: query.datimAgeGroup,
                },
            );
        }

        return await medianTimeToARTPartnerSql
            .groupBy(
                'Sitecode, FacilityName, County, SubCounty, CTPartner, CTAgency, Datepart (month,ExitDate) , Datepart (year,ExitDate)',
            )
            .getRawMany();
    }
}
