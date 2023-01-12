import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { GetArtVerificationReasonsQuery } from './../impl/get-art-verification-reasons.query';

@QueryHandler(GetArtVerificationReasonsQuery)
export class GetArtVerificationReasonsHandler
    implements IQueryHandler<GetArtVerificationReasonsQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>,
    ) {}

    async execute(query: GetArtVerificationReasonsQuery): Promise<any> {
        let params = [];
        const nonReasons = `
            with EnrichedFullfacilitylist As (
                Select
                    distinct cast(Allsites.MFLCode collate Latin1_General_CI_AS as nvarchar) as MFLCode,
                    Allsites.FacilityName,
                    Allsites.County,
                    Allsites.FacilityType,
                    EMRs.EMR,
                    coalesce(EMRs.SDP, Allsites.SDIP) As SDIP,
                    coalesce(EMRs.[SDP Agency], Allsites.Agency) as Agency
                from  HIS_Implementation.dbo.EMRandNonEMRSites as Allsites
                left join HIS_Implementation.dbo.All_EMRSites  EMRs on EMRs.MFL_Code=Allsites.MFLCode
            ),PSurveys as (
                Select
                    *
                FROM [pSurvey].[dbo].[stg_questionnaire_responses]
            ), FacilitySummary AS (
                select
                    EnrichedFullfacilitylist.MFLCode as MFLCode,
                    EnrichedFullfacilitylist.FacilityName as Facility,
                    EnrichedFullfacilitylist.SDIP,
                    EnrichedFullfacilitylist.EMR as EMR,
                    EnrichedFullfacilitylist.FacilityType,
                    EnrichedFullfacilitylist.County,
                    EnrichedFullfacilitylist.Agency,
                    PSurveys.non_verification_reason
                from EnrichedFullfacilitylist
                left join PSurveys on PSurveys.mfl_code=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                group by
                    EnrichedFullfacilitylist.MFLCode,
                    EnrichedFullfacilitylist.FacilityName,
                    EnrichedFullfacilitylist.SDIP,
                    EnrichedFullfacilitylist.EMR,
                    EnrichedFullfacilitylist.FacilityType,
                    EnrichedFullfacilitylist.County,
                    EnrichedFullfacilitylist.Agency,
                    PSurveys.non_verification_reason
            ) Select
                count(*), non_verification_reason
                FROM FacilitySummary
                where FacilitySummary.FacilityType = 'emr'
                group by non_verification_reason
                order by count(*);
        `;

        if (query.county) {
            params.push(query.county);
        }

        if (query.subCounty) {
            params.push(query.subCounty);
        }

        if (query.facility) {
            params.push(query.facility);
        }

        if (query.partner) {
            params.push(query.partner);
        }

        if (query.agency) {
            params.push(query.agency);
        }

        return await this.repository.query(nonReasons, params);
    }
}
