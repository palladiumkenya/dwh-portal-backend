import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrVerifiedQuery } from '../impl/get-ct-tx-curr-verified.query';
import { FactNUPI } from '../../entities/fact-nupi.model';

@QueryHandler(GetCtTxCurrVerifiedQuery)
export class GetCtTxCurrVerifiedHandler
    implements IQueryHandler<GetCtTxCurrVerifiedQuery> {
    constructor(
        @InjectRepository(FactNUPI, 'mssql')
        private readonly repository: Repository<FactNUPI>,
    ) {}

    async execute(query: GetCtTxCurrVerifiedQuery): Promise<any> {
        const txCurr = this.repository
            .createQueryBuilder('f')
            .select(['sum (NumNUPI) NumNupi'])
            .where('f.[Gender] IS NOT NULL');

        if (query.county) {
            txCurr.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurr.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurr.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurr.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurr.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurr.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            txCurr.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurr.getRawOne();
    }
}
