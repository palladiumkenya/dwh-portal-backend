import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { GetArtVerificationPendingSurveysByPartnerQuery } from '../impl/get-art-verification-pending-surveys-by-partner.query';

@QueryHandler(GetArtVerificationPendingSurveysByPartnerQuery)
export class GetArtVerificationPendingSurveysByPartnerHandler
    implements IQueryHandler<GetArtVerificationPendingSurveysByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>,
    ) {}

    async execute(
        query: GetArtVerificationPendingSurveysByPartnerQuery,
    ): Promise<any> {
        let params = [];
        let pendingByPartner = `
            with EnrichedFullfacilitylist As (
            -- get the full facilities list with enriched columns
                Select
                    distinct cast(Allsites.MFL_Code collate Latin1_General_CI_AS as nvarchar) as MFLCode,
                    Allsites.Facility_Name,
                    Allsites.County,
                    Allsites.FacilityType,
                    EMRs.EMR,
                    coalesce(EMRs.SDP, Allsites.SDP) As SDIP,
                    coalesce(EMRs.[SDP_Agency], Allsites.SDP_Agency) as Agency
                from  HIS_Implementation.dbo.EMRandNonEMRSites as Allsites
                left join ODS.dbo.All_EMRSites  EMRs on EMRs.MFL_Code=Allsites.MFL_Code
            ),
            --Pick Only the EMR Sites
            EMRSites as (
                select
                    distinct
                    [Facility_Name] AS FacilityName,
                    cast (MFL_Code as nvarchar) As MFLCode,
                    County,
                    SDP,
                    EMR,
                    [SDP_Agency]
                from HIS_Implementation.dbo.All_EMRSites
                where [EMR_Status] = 'Active'
            ),
            --Obtain the latest reporting month in KHIS and pick the latest TXCurr--
            latest_reporting_month as (
                select distinct
                    cast (SiteCode as nvarchar) SiteCode,
                    max(ReportMonth_Year) as reporting_month
                from ODS.dbo.CT_DHIS2 as khis
                where CurrentOnART_Total is not null
                    and datediff(
                        mm,
                        cast(concat(ReportMonth_Year, '01') as date),
                        (select max(cast(concat(ReportMonth_Year, '01') as date)
                        ) from ODS.dbo.CT_DHIS2)    
                    ) <= 6
                group by SiteCode
            ),
            --
            khis as (
                select distinct
            cast (khis.SiteCode as nvarchar) As SiteCode,
                    latest_reporting_month.reporting_month,
                    sum(CurrentOnART_Total) as TXCurr_khis
                from ODS.dbo.CT_DHIS2 as khis
                inner join latest_reporting_month on latest_reporting_month.SiteCode = khis.SiteCode
                    and khis.ReportMonth_Year = latest_reporting_month.reporting_month
            where CurrentOnART_Total is not null
                group by
                    khis.SiteCode,
                    latest_reporting_month.reporting_month
            ),
            --Obtain the number of verified records in Central registry per site--
            nupi_overall as (
                select
                    cast (origin_facility_kmfl_code as nvarchar) As facility_code,
                    count(distinct concat(origin_facility_kmfl_code, '-', ccc_no)) as nupi_Overall
                from tmp_and_adhoc.dbo.nupi_dataset as nupi_dataset
                where (ccc_no is not null or ccc_no <> 'nan')
                group by origin_facility_kmfl_code
            ),
            nupi_non_art_clients as (
            -- counts of clients who are non-art clients but verified grouped by facility_code
                select
                    cast (origin_facility_kmfl_code as  nvarchar) As facility_code,
                    count(*) as nupi_non_art_clients
                from tmp_and_adhoc.dbo.nupi_dataset as nupi_dataset
                where (ccc_no is null or ccc_no = 'nan')
                group by origin_facility_kmfl_code
            ),
            --Groupings of clients with Nupi in DWH per site---
            dwh_nupi_by_facility as (
                select
                cast (SiteCode as nvarchar) As MFLCode,
                    sum ( numnupi) as count_patients
                from REPORTING.dbo.AggregateNupi
                group by
                    SiteCode
            ),
            --Obtain records of children < 18 years with Nupi in DWH per site--
            dwh_nupi_by_facility_children as (
                select
                    cast (SiteCode as nvarchar) As MFLCode,
                    sum ( children) as count_patients
                from REPORTING.dbo.AggregateNupi(nolock)
                group by
                    SiteCode
            ),
            --Obtain records of Adults > 18 years with Nupi in DWH per site
            dwh_nupi_by_facility_adults as (
                select
                    cast (SiteCode as nvarchar) As MFLCode,
                    sum (adults) as count_patients
                from REPORTING.dbo.AggregateNupi (nolock)
                group by
                    SiteCode
            ),
            --Obtain Adults TXCurr for adults in DWH per site----
            dwh_by_facility_adults as (
                select
                    cast (SiteCode as nvarchar) As MFLCode,
                    count(distinct concat(PatientIDHash, PatientPKHash, SiteCode)) as count_AdultsTXCurDWH
                from REPORTING.dbo.Linelist_FACTART (nolock)
                where  ARTOutcomeDescription ='Active' and age >= 18 and age <= 120
                group by
                    SiteCode
            ),
            --Obtain the latest upload date for each site--
            latest_upload as (
                select
                    cast ( t.SiteCode as nvarchar) As SiteCode,
                        max(cast(t.DateRecieved as date)) as LatestDateUploaded
                from DWAPICentral.dbo.FacilityManifest(NoLock) t
                group by t.[SiteCode]
            ),
            --Obtain the Paeds TXCurr per site in DWH--
            Children As (
                select
                    cast (SiteCode as nvarchar) As MFLCode,
                    count(distinct concat(PatientIDHash, PatientPKHash, SiteCode)) as count_Paeds
                from REPORTING.dbo.Linelist_FACTART (nolock)
                where  ARTOutcomeDescription ='Active' and age < 18
                group by
                    SiteCode
            ),
            Grouping_Paeds As (
            Select
                    cast (MFLCode as nvarchar) As MFLCode,
                    sum (count_Paeds) As PaedsTXCurr_DWH
            from Children
            group by
                    MFLcode
            ),
            PSurveys As (
            Select
                cast (mfl_code as nvarchar) As MFLCode,
                count (distinct survey_id) AS SurveysReceived
                FROM [pSurvey].[dbo].[stg_questionnaire_responses]
                Group by mfl_code
            ),
            verified_but_with_survey as (
            select
            origin_facility_kmfl_code as mfl_code,
            count(distinct concat(nupi.ccc_no, '-', nupi.origin_facility_kmfl_code)) as count_of_patients
            from tmp_and_adhoc.dbo.nupi_dataset as nupi
            inner join [pSurvey].[dbo].[stg_questionnaire_responses] as surveys on surveys.ccc_no = nupi.ccc_no
            and cast(surveys.mfl_code as varchar) = nupi.origin_facility_kmfl_code
            group by origin_facility_kmfl_code
            ),
            FacilitySummary AS (
                select
                    EnrichedFullfacilitylist.MFLCode as MFLCode,
                    EnrichedFullfacilitylist.Facility_Name as Facility,
                    EnrichedFullfacilitylist.SDIP,
                    EnrichedFullfacilitylist.EMR as EMR,
                    EnrichedFullfacilitylist.FacilityType,
                    EnrichedFullfacilitylist.County,
                    EnrichedFullfacilitylist.Agency,
                    khis.reporting_month as khis_reporting_month,
                    latest_upload.LatestDateUploaded as LatestDateUploaded,
                    sum(TXCurr_khis) as TXCurr_khis,
                    coalesce (nupi_overall.nupi_overall,0) AS NUPIVerified,
                    coalesce(round(sum(cast(nupi_overall.nupi_overall as float)) / cast(sum(TXCurr_khis) as float), 2), 0)  as proportion_of_KHIS_with_NUPIVerified_MOH,
                    coalesce (nupi_non_art_clients.nupi_non_art_clients,0) As nupi_non_art_clients,
                    coalesce(round(sum(cast(nupi_non_art_clients.nupi_non_art_clients as float)) / cast(sum(TXCurr_khis) as float), 2), 0)  as proportion_of_KHIS_with_NUPINotVerified_MOH,
                    coalesce(dwh_nupi_by_facility.count_patients, 0) as count_patients_nupi_sent_to_dwh,
                    coalesce(round(sum(cast(dwh_nupi_by_facility.count_patients as float)) / cast(sum(TXCurr_khis) as float), 2), 0)  as proportion_of_KHIS_with_nupi_no_sent_to_dwh,
                    coalesce(dwh_nupi_by_facility_adults.count_patients, 0) as count_adults_patients_nupi_sent_to_dwh,
                    coalesce(dwh_nupi_by_facility_children.count_patients, 0) as count_children_patients_nupi_sent_to_dwh,
                    coalesce(round(cast(sum(dwh_nupi_by_facility_adults.count_patients) as float)/cast(sum(dwh_nupi_by_facility.count_patients) as float), 2), 0)  as proportion_of_adults_with_nupi_sent_to_dwh,
                    coalesce(round(cast(sum(dwh_nupi_by_facility_children.count_patients) as float)/cast(sum(dwh_nupi_by_facility.count_patients) as float),2), 0) as proportion_of_children_with_nupi_sent_to_dwh,
                    coalesce(PaedsTXCurr_DWH,0) As PaedsTXCurr_DWH,
                    coalesce (count_AdultsTXCurDWH,0) As AdultsTxCurr_DWH,
                    coalesce (SurveysReceived,0) As SurveysReceived,
                    coalesce(verified_but_with_survey.count_of_patients,0) as patients_verified_but_with_survey
                from EnrichedFullfacilitylist
                left join khis on cast (khis.SiteCode as nvarchar) = cast (EnrichedFullfacilitylist.MFLCode as nvarchar)
                full outer join dwh_nupi_by_facility on dwh_nupi_by_facility.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                full outer join dwh_nupi_by_facility_adults on dwh_nupi_by_facility_adults.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                full outer join dwh_nupi_by_facility_children on dwh_nupi_by_facility_children.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join latest_upload on latest_upload.SiteCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join Grouping_Paeds on Grouping_Paeds.MFLCode=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join dwh_by_facility_adults on dwh_by_facility_adults.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join nupi_overall on nupi_overall.facility_code=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join nupi_non_art_clients on nupi_non_art_clients.facility_code=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join PSurveys on PSurveys.MFLCode=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join verified_but_with_survey on verified_but_with_survey.mfl_code = EnrichedFullfacilitylist.MFLCode
                group by
                    EnrichedFullfacilitylist.MFLCode,
                    EnrichedFullfacilitylist.Facility_Name,
                    EnrichedFullfacilitylist.SDIP,
                    EnrichedFullfacilitylist.EMR,
                    EnrichedFullfacilitylist.FacilityType,
                    EnrichedFullfacilitylist.County,
                    EnrichedFullfacilitylist.Agency,
                    coalesce (nupi_overall,0),
                    coalesce (nupi_non_art_clients,0),
                    dwh_nupi_by_facility.count_patients,
                    coalesce(dwh_nupi_by_facility_adults.count_patients, 0),
                    coalesce(dwh_nupi_by_facility_children.count_patients, 0),
                    khis.reporting_month,
                    latest_upload.LatestDateUploaded,
                    coalesce (PaedsTXCurr_DWH,0),
                    coalesce(count_AdultsTXCurDWH,0),
                    coalesce (SurveysReceived,0),
                    coalesce(verified_but_with_survey.count_of_patients,0)
            )
            select
                sum (count_patients_nupi_sent_to_dwh) As NupiVerified,
                sum(TXCurr_khis) As TxCurr,
                FacilitySummary.SDIP,
                sum (TXCurr_khis)-sum (NUPIVerified) As 'Unverified',
                sum (SurveysReceived) As SurveysReceived,
                sum (TXCurr_khis)-sum (NUPIVerified)-sum (SurveysReceived) As Pendingsurveys
            from FacilitySummary
            where 
                FacilitySummary.FacilityType  like '%EMR%'
        `;

        if (query.county) {
            pendingByPartner = `${pendingByPartner} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.county);
        }

        if (query.subCounty) {
            pendingByPartner = `${pendingByPartner} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.subCounty);
        }

        if (query.facility) {
            pendingByPartner = `${pendingByPartner} and FacilitySummary.Facility IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.facility);
        }

        if (query.partner) {
            pendingByPartner = `${pendingByPartner} and SDIP IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.partner);
        }

        if (query.agency) {
            pendingByPartner = `${pendingByPartner} and Agency IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.agency);
        }

        pendingByPartner = `${pendingByPartner} 
            group by
                FacilitySummary.SDIP`;

        return await this.repository.query(pendingByPartner, params);
    }
}
