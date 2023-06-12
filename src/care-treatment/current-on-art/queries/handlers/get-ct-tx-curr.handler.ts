import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrQuery } from '../impl/get-ct-tx-curr.query';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';

@QueryHandler(GetCtTxCurrQuery)
export class GetCtTxCurrHandler implements IQueryHandler<GetCtTxCurrQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>,
    ) {}

    async execute(query: GetCtTxCurrQuery): Promise<any> {
        const txCurr = this.repository
            .createQueryBuilder('f')
            .select(['Count(*) TXCURR'])
            .where(
                "f.[Gender] IS NOT NULL and ARTOutcome ='V' AND ageLV BETWEEN 0 and 120",
            );

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

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurr.andWhere('f.ageLV >= 18');
            else if (query.datimAgePopulations.includes('<18'))
                txCurr.andWhere('f.ageLV < 18');
        }

        if (query.gender) {
            txCurr.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurr.getRawOne();
    }
}
