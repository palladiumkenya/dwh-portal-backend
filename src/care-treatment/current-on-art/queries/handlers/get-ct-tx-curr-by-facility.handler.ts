import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCtTxCurrByFacilityQuery } from '../impl/get-ct-tx-curr-by-facility.query';
import { FactTransHmisStatsTxcurr } from './../../entities/fact-trans-hmis-stats-txcurr.model';

@QueryHandler(GetCtTxCurrByFacilityQuery)
export class GetCtTxCurrByFacilityHandler
    implements IQueryHandler<GetCtTxCurrByFacilityQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>,
    ) {}

    async execute(query: GetCtTxCurrByFacilityQuery): Promise<any> {
        const txCurrByPartner = this.repository
            .createQueryBuilder('f')
            .select([
                'FacilityName, CTPartner, County, Subcounty,CTAgency, MFLCode, sum (TXCURR_Total) TXCURR',
            ])
            .where('f.[Gender] IS NOT NULL');

        if (query.county) {
            txCurrByPartner.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrByPartner.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            txCurrByPartner.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            txCurrByPartner.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            txCurrByPartner.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            txCurrByPartner.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            txCurrByPartner.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txCurrByPartner
            .groupBy(
                'CTPartner, County, Subcounty, CTAgency, MFLCode, FacilityName',
            )
            .orderBy('MFLCode', 'DESC')
            .getRawMany();
    }
}
