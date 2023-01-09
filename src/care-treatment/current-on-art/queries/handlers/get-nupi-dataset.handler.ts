import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetNupiDatasetQuery } from '../impl/get-nupi-dataset.query';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';

@QueryHandler(GetNupiDatasetQuery)
export class GetNupiDatasetHandler
    implements IQueryHandler<GetNupiDatasetQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>,
    ) {}

    async execute(query: GetNupiDatasetQuery): Promise<any> {
        const params = [];
        const nupiDataset = `
            with EnrichedFullfacilitylist As (
            -- get the full facilities list with enriched columns
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
            ),
            --Pick Only the EMR Sites
            EMRSites as (
                select
                    distinct
                    [Facility Name] AS FacilityName,
                    cast (MFL_Code as nvarchar) As MFLCode,
                    County,
                    SDP,
                    EMR,
                    [SDP Agency]
                from HIS_Implementation.dbo.All_EMRSites
                where [EMR Status] = 'Active'
            ),
            --Obtain the latest reporting month in KHIS and pick the latest TXCurr--
            latest_reporting_month as (
                select distinct
                    cast (SiteCode as nvarchar) SiteCode,
                    max(ReportMonth_Year) as reporting_month
                from All_Staging_2016_2.dbo.FACT_CT_DHIS2 as khis
                where CurrentOnART_Total is not null
                    and (select max(cast(ReportMonth_Year as int)) from All_Staging_2016_2.dbo.FACT_CT_DHIS2)  - cast(ReportMonth_Year as int) <= 6
                group by SiteCode
            ),
            --
            khis as (
                select distinct
            cast (khis.SiteCode as nvarchar) As SiteCode,
                    latest_reporting_month.reporting_month,
                    sum(CurrentOnART_Total) as TXCurr_khis
                from All_Staging_2016_2.dbo.FACT_CT_DHIS2 as khis
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
                cast (MFLCode as nvarchar) As MFLCode,
                    sum ( NumNUPI) as count_patients
                from PortalDevTest.dbo.FACT_NUPI
                group by
                    MFLCode
            ),
            --Obtain records of children < 18 years with Nupi in DWH per site--
            dwh_nupi_by_facility_children as (
                select
                    cast (MFLCode as nvarchar) As MFLCode,
                    sum ( Children) as count_patients
                from PortalDevTest.dbo.FACT_NUPI(nolock)
                group by
                    MFLCode
            ),
            --Obtain records of Adults > 18 years with Nupi in DWH per site
            dwh_nupi_by_facility_adults as (
                select
                    cast (MFLCode as nvarchar) As MFLCode,
                    sum (Adults) as count_patients
                from PortalDevTest.dbo.FACT_NUPI (nolock)
                group by
                    MFLCode
            ),
            --Obtain Adults TXCurr for adults in DWH per site----
            dwh_by_facility_adults as (
                select
                    cast (MFLCode as nvarchar) As MFLCode,
                    count(distinct concat(Patientid, PatientPK, MFLCode)) as count_AdultsTXCurDWH
                from PortalDev.dbo.Fact_Trans_New_Cohort (nolock)
                where  ARTOutcome ='V' and ageLV >= 18 and ageLV <= 120
                group by
                    MFLCode
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
                    cast (MFLCode as nvarchar) As MFLCode,
                    count(distinct concat(Patientid, PatientPK, MFLCode)) as count_Paeds
                from PortalDev.dbo.Fact_Trans_New_Cohort (nolock)
                where  ARTOutcome ='V' and ageLV < 18
                group by
                    MFLCode
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
            FacilitySummary AS (
                select
                    EnrichedFullfacilitylist.MFLCode as MFLCode,
                    EnrichedFullfacilitylist.FacilityName as Facility,
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
                    coalesce (SurveysReceived,0) As SurveysReceived
                from EnrichedFullfacilitylist
                left join khis on cast (khis.SiteCode as nvarchar) = cast (EnrichedFullfacilitylist.MFLCode as nvarchar)
                left join dwh_nupi_by_facility on dwh_nupi_by_facility.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join dwh_nupi_by_facility_adults on dwh_nupi_by_facility_adults.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join dwh_nupi_by_facility_children on dwh_nupi_by_facility_children.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join latest_upload on latest_upload.SiteCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join Grouping_Paeds on Grouping_Paeds.MFLCode=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join dwh_by_facility_adults on dwh_by_facility_adults.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join nupi_overall on nupi_overall.facility_code=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join nupi_non_art_clients on nupi_non_art_clients.facility_code=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join PSurveys on PSurveys.MFLCode=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                group by
                    EnrichedFullfacilitylist.MFLCode,
                    EnrichedFullfacilitylist.FacilityName,
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
                    coalesce (SurveysReceived,0)
            )
            select
                getdate() as DateQueried,
                FacilitySummary.MFLCode,
                Facility,
                FacilitySummary.SDIP,
                FacilitySummary.Agency,
                FacilitySummary.EMR,
                FacilitySummary.FacilityType,
                upper (FacilitySummary.County) As County,
                LatestDateUploaded,
                khis_reporting_month as 'KHIS TXCurr Latest Reporting Month',
                sum(TXCurr_khis) AS 'KHIS TXCurr',
                sum (NUPIVerified) As '# MOH Central Registry Verified',
                coalesce(round(cast(sum(NUPIVerified) as float) / cast(sum(TXCurr_khis) as float), 2), 0) as '% MOH Central Registry verified of KHIS TXCurr',
                sum (nupi_non_art_clients) As '# MOH UPI for non-art clients',
                sum (count_patients_nupi_sent_to_dwh) As '# DWH verified & Matched',
                round(cast(sum(count_patients_nupi_sent_to_dwh) as float) / cast(sum(TXCurr_khis) as float), 2) as '% DWH verified of KHIS TXCurr',
                sum(count_children_patients_nupi_sent_to_dwh) As '# Children DWH verified & Matched',
                sum(PaedsTXCurr_DWH) As '# Children TXCurr  DWH',
                coalesce(round(cast(sum(count_children_patients_nupi_sent_to_dwh) as float) / nullif(cast(sum(PaedsTXCurr_DWH) as float), 0),2), 0) as '% Children DWH verified of Chidren TXCurr DWH',
                sum(count_adults_patients_nupi_sent_to_dwh) As '# Adults DWH verified & Matched',
                sum(AdultsTxCurr_DWH) As '# Adults TXCurr DWH' ,
                coalesce(round (cast(sum(count_adults_patients_nupi_sent_to_dwh) as float) / nullif(cast(sum(AdultsTxCurr_DWH) as float),0),2),0) As '% Adults DWH verified of Adults TXCurr DWH',
                sum (TXCurr_khis)-sum (NUPIVerified) As '#Unverified',
                sum (SurveysReceived) As SurveysReceived,
                sum (TXCurr_khis)-sum (NUPIVerified)-sum (SurveysReceived) As Pendingsurveys
            from FacilitySummary
            group by
                FacilitySummary.Facility,
                FacilitySummary.MFLCode,
                FacilitySummary.Agency,
                FacilitySummary.SDIP,
                FacilitySummary.EMR,
                FacilitySummary.FacilityType,
                FacilitySummary.County,
                FacilitySummary.Agency,
                khis_reporting_month,
                LatestDateUploaded;
        `;

        if (query.county) {
            params.push(query.county)
        }

        if (query.subCounty) {
            params.push(query.subCounty)
        }

        if (query.facility) {
            params.push(query.facility)
        }

        if (query.partner) {
            params.push(query.partner)
        }

        if (query.agency) {
            params.push(query.agency)
        }

        if (query.datimAgeGroup) {
            params.push(query.datimAgeGroup)
        }

        if (query.gender) {
            params.push(query.gender);
        }

        return this.repository.query(nupiDataset, params);
    }
}