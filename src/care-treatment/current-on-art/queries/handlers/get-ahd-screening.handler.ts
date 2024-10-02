import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAhdScreeningQuery } from '../impl/get-ahd-screening.query';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetAhdScreeningQuery)
export class GetAhdScreeningHandler implements IQueryHandler<GetAhdScreeningQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(query: GetAhdScreeningQuery): Promise<any> {
        const ahdScreening = this.repository
            .createQueryBuilder('f')
            .select([`
                SUM(NewRTTSTF) as NewPatient,
                -- ahd screened
                COUNT(WhoStage) AS AHDScreened,
                SUM(AHD) AS AHD,
                SUM(DoneCD4Test) AS DoneCD4Test,
                SUM(CD4Lessthan200) AS less200CD4,
                SUM(DoneTBLamTest) AS DoneTBLamTest,
                SUM(TBLamPositive) AS TBLamPositive,
                --SUM(OntbTreatment) AS tbInitiated,
                0 AS tbInitiated,
                SUM(DoneCrAgTest) AS DoneCrAgTest,
                SUM(CrAgPositive) AS CrAgPositive,
                SUM(CSFCrAg) AS CSFCrAg,
                SUM(CSFCrAgPositive) AS CSFCrAgPositive,
                SUM(InitiatedCMTreatment) AS InitiatedCMTreatment,
                SUM(PreemtiveCMTheraphy) AS PreemtiveCMTheraphy
            `])
            .where(`StartARTDate >= DATEADD(MONTH, DATEDIFF(MONTH,0, GETDATE()) -1,0) and StartARTDate <DATEADD(MONTH,DATEDIFF(MONTH, 0, GETDATE()), 0)`);

        if (query.county) {
            ahdScreening.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            ahdScreening.andWhere('f.Subcounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            ahdScreening.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            ahdScreening.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            ahdScreening.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            ahdScreening.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            ahdScreening.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await ahdScreening.getRawOne();
    }
}
