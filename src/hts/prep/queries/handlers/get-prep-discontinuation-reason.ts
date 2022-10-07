import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactPrep } from '../../entities/fact-prep.model';
import { GetPrepDiscontinuationReasonQuery } from '../impl/get-prep-discontinuation-reason.query';

@QueryHandler(GetPrepDiscontinuationReasonQuery)
export class GetPrepDiscontinuationReasonHandler
    implements IQueryHandler<GetPrepDiscontinuationReasonQuery> {
    constructor(
        @InjectRepository(FactPrep, 'mssql')
        private readonly repository: Repository<FactPrep>,
    ) {}

    async execute(query: GetPrepDiscontinuationReasonQuery): Promise<any> {
        let prepDiscontinuation = this.repository
            .createQueryBuilder('f')
            .select([
                'COUNT ( DISTINCT ( concat ( PrepNumber, PatientPk, SiteCode ) )  )AS PrepDiscontinuations, ExitReason',
            ])
            .where(
                'ExitDate is not null and  DATEDIFF(month, ExitDate, GETDATE()) = 2',
            );

        if (query.county) {
            prepDiscontinuation.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            prepDiscontinuation.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.partner) {
            prepDiscontinuation.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            prepDiscontinuation.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.gender) {
            prepDiscontinuation.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgeGroup) {
            prepDiscontinuation.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.year) {
            prepDiscontinuation.andWhere('Datepart( YEAR, ExitDate )', {});
        }

        if (query.month) {
            prepDiscontinuation.andWhere('Datepart( MONTH, ExitDate )', {});
        }

        return await prepDiscontinuation
            .groupBy('ExitReason')
            .orderBy('PrepDiscontinuations', 'DESC')
            .getRawMany();
    }
}
