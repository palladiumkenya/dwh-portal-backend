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
        const nupiDataset = 
            `with get_latest_month as (
                -- get ordered KHIS list for each facility
                select 
                    SiteCode,
                    FacilityName,
                    ReportMonth_Year,
                    row_number() over (partition by SiteCode order by ReportMonth_Year desc) as rank
                from PortalDev.dbo.FACT_CT_DHIS2_NUPI
            ),
            latest_facility_names as (
            -- select the latest FacilityName from KHIS
                select 
                    distinct khis.SiteCode,
                    get_latest_month.FacilityName,
                    rank
                from PortalDev.dbo.FACT_CT_DHIS2_NUPI as khis
                inner join get_latest_month on khis.SiteCode = get_latest_month.SiteCode
                where rank = 1
            ),
            facilities_list as (
            -- get the latest SiteCode & Facilityname
                select
                    distinct
                    cast (khis.SiteCode as nvarchar) As MFLCode ,
                    latest_facility_names.FacilityName AS FacilityName,
                    County 
                from PortalDev.dbo.FACT_CT_DHIS2_NUPI as khis
                left join latest_facility_names on latest_facility_names.SiteCode = khis.SiteCode
            where  (select max(cast(ReportMonth_Year as int)) from PortalDev.dbo.FACT_CT_DHIS2_NUPI)  - cast(khis.ReportMonth_Year as int) <= 6  and CurrentOnART_Total is not null and khis.SiteCode is not null
            ),
            --In NUPI dataset not in KHIS 
            InNupi_not_in_khis As (
            Select
                cast (origin_facility_kmfl_code as nvarchar) AS origin_facility_kmfl_code
            from tmp_and_adhoc.dbo.nupi_dataset
            Except
            Select 
            Sitecode collate Latin1_General_CI_AS
            from All_Staging_2016_2.dbo.FACT_CT_DHIS2
            ),

            Nupi_not_khis_facility_list AS (
            Select 
                cast (origin_facility_kmfl_code as nvarchar) As origin_facility_kmfl_code,
                facility,
                county
            from tmp_and_adhoc.dbo.nupi_dataset
            where origin_facility_kmfl_code in (Select origin_facility_kmfl_code from InNupi_not_in_khis)
            ),
            Fullfacility_list AS (
            -- union of list from KHIS & nupi dataset
                Select 
                    cast (MFLCode collate Latin1_General_CI_AS As nvarchar) As MFLCode,
                    FacilityName  collate Latin1_General_CI_AS AS FacilityName,
                County collate Latin1_General_CI_AS AS County
                from facilities_list
                Union
                Select 
                    cast (origin_facility_kmfl_code AS nvarchar) As MFLCode,
                    facility   collate Latin1_General_CI_AS As FacilityName ,
                county  collate Latin1_General_CI_AS AS County
                from Nupi_not_khis_facility_list
            ),
            EnrichedFullfacilitylist As (
            -- get the full facilities list with enriched columns
                Select 
                    Fullfacility_list.MFLCode,
                    Fullfacility_list.FacilityName,
                    Fullfacility_list.County,
                    Allsites.FacilityType,
                    EMRs.EMR,
                    coalesce(EMRs.SDP, Allsites.SDIP) As SDIP,
                    coalesce(EMRs.[SDP Agency], Allsites.Agency) as Agency
                from  HIS_Implementation.dbo.EMRandNonEMRSites as Allsites
                left join HIS_Implementation.dbo.All_EMRSites  EMRs on EMRs.MFL_Code=Allsites.MFLCode
                left  join Fullfacility_list on Fullfacility_list.MFLCode = Allsites.MFLCode
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
                from PortalDev.dbo.FACT_CT_DHIS2_NUPI as khis
                where CurrentOnART_Total is not null
                    and (select max(cast(ReportMonth_Year as int)) from PortalDev.dbo.FACT_CT_DHIS2_NUPI)  - cast(ReportMonth_Year as int) <= 6
                group by SiteCode
            ),
            --
            khis as (
                select distinct
            cast (khis.SiteCode as nvarchar) As SiteCode,
                    latest_reporting_month.reporting_month,
                    sum(CurrentOnART_Total) as TXCurr_khis
                from PortalDev.dbo.FACT_CT_DHIS2_NUPI as khis
                inner join latest_reporting_month on latest_reporting_month.SiteCode = khis.SiteCode
                    and khis.ReportMonth_Year = latest_reporting_month.reporting_month
            where CurrentOnART_Total is not null
                group by
                    khis.SiteCode,
                    latest_reporting_month.reporting_month
            ),
            --Count the number of records with missing CCC Numbers per site--
            missing_ccc_nos as (
                select
                    cast (origin_facility_kmfl_code as nvarchar) As facility_code,
                    facility_type,
                    count(*) as count_missing_ccc
                from tmp_and_adhoc.dbo.nupi_dataset as nupi_dataset
                where ccc_no ='nan'
                group by origin_facility_kmfl_code,
            facility_type
            ),
            --Count the number of complete  records  per site
            With_ccc_nos as (
                select
                    cast (origin_facility_kmfl_code as nvarchar) As facility_code,
                    --facility_type,
                    count(*) as count_with_CCC_CR
                from tmp_and_adhoc.dbo.nupi_dataset as nupi_dataset
                where ccc_no <> 'nan'
                group by origin_facility_kmfl_code,facility_type
            ),
            --Obtain the list of matching records between Central registry and DWH--
            nupi as (
            select
                distinct PatientID as client_upn,
                replace(ccc_no, '-' , '') as nupi_no,
                cast (MFLCode as nvarchar) As MFLCode
            from tmp_and_adhoc.dbo.nupi_dataset as nupi_dataset
            inner join portalDevTest.dbo.Fact_Trans_New_Cohort as cohort on replace(nupi_dataset.ccc_no, '-' , '') = cohort.PatientID
                and nupi_dataset.origin_facility_kmfl_code = cohort.MFLCode
            ),
            --Obtain the number of verified records in Central registry per site--
            nupi_overall as (
                select
                    cast (origin_facility_kmfl_code as nvarchar) As facility_code,
                    count(*) as nupi_Overall
                from tmp_and_adhoc.dbo.nupi_dataset as nupi_dataset
                where  ccc_no is not null
                group by origin_facility_kmfl_code
            ),
            nupi_NotVerified as (
                select
                    cast (origin_facility_kmfl_code as  nvarchar) As facility_code,
                    count(*) as nupi_NotVerified
                from tmp_and_adhoc.dbo.nupi_dataset as nupi_dataset
                where ccc_no is null
                group by origin_facility_kmfl_code
            ),
            --Count the number of clients with Nupi per site in DWH--
            nupi_by_facility as (
            select
                cast (MFLCode as nvarchar) As MFLCode,
                    count(*) as clients_with_nupi,
                    missing_ccc_nos.count_missing_ccc,
                    With_ccc_nos.count_with_CCC_CR
                from nupi
                left join missing_ccc_nos on missing_ccc_nos.facility_code = nupi.MFLCode
                left join With_ccc_nos on With_ccc_nos.facility_code=nupi.MFLCode
                group by
                    MFLCode,
                    missing_ccc_nos.count_missing_ccc,
                    With_ccc_nos.count_with_CCC_CR
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
            FacilitySummary AS (
                select distinct
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
                    coalesce (nupi_NotVerified.nupi_NotVerified,0) As nupi_NotVerified,
                    coalesce(round(sum(cast(nupi_NotVerified.nupi_NotVerified as float)) / cast(sum(TXCurr_khis) as float), 2), 0)  as proportion_of_KHIS_with_NUPINotVerified_MOH,
                    coalesce(dwh_nupi_by_facility.count_patients, 0) as count_patients_nupi_sent_to_dwh,
                    coalesce(round(sum(cast(dwh_nupi_by_facility.count_patients as float)) / cast(sum(TXCurr_khis) as float), 2), 0)  as proportion_of_KHIS_with_nupi_no_sent_to_dwh,
                    coalesce(dwh_nupi_by_facility_adults.count_patients, 0) as count_adults_patients_nupi_sent_to_dwh,
                    coalesce(dwh_nupi_by_facility_children.count_patients, 0) as count_children_patients_nupi_sent_to_dwh,
                    coalesce(round(cast(sum(dwh_nupi_by_facility_adults.count_patients) as float)/cast(sum(dwh_nupi_by_facility.count_patients) as float), 2), 0)  as proportion_of_adults_with_nupi_sent_to_dwh,
                    coalesce(round(cast(sum(dwh_nupi_by_facility_children.count_patients) as float)/cast(sum(dwh_nupi_by_facility.count_patients) as float),2), 0) as proportion_of_children_with_nupi_sent_to_dwh,
                    coalesce(PaedsTXCurr_DWH,0) As PaedsTXCurr_DWH,
                    coalesce (count_AdultsTXCurDWH,0) As AdultsTxCurr_DWH
                from EnrichedFullfacilitylist
                left join khis on cast (khis.SiteCode as nvarchar) = cast (EnrichedFullfacilitylist.MFLCode as nvarchar)
                left join nupi_by_facility on nupi_by_facility.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join dwh_nupi_by_facility on dwh_nupi_by_facility.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join dwh_nupi_by_facility_adults on dwh_nupi_by_facility_adults.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join dwh_nupi_by_facility_children on dwh_nupi_by_facility_children.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join latest_upload on latest_upload.SiteCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join Grouping_Paeds on Grouping_Paeds.MFLCode=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join dwh_by_facility_adults on dwh_by_facility_adults.MFLCode = EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join nupi_overall on nupi_overall.facility_code=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                left join nupi_NotVerified on nupi_NotVerified.facility_code=EnrichedFullfacilitylist.MFLCode collate Latin1_General_CI_AS
                group by
                    EnrichedFullfacilitylist.MFLCode,
                    EnrichedFullfacilitylist.FacilityName,
                    EnrichedFullfacilitylist.SDIP,
                    EnrichedFullfacilitylist.EMR,
                    EnrichedFullfacilitylist.FacilityType,
                    EnrichedFullfacilitylist.County,
                    EnrichedFullfacilitylist.Agency,
                    --coalesce(nupi_by_facility.count_missing_ccc, 0),
                    --coalesce(nupi_by_facility.count_with_CCC_CR, 0),
                    coalesce (nupi_overall,0),
                    coalesce (nupi_NotVerified,0),
                    dwh_nupi_by_facility.count_patients,
                    coalesce(dwh_nupi_by_facility_adults.count_patients, 0),
                    coalesce(dwh_nupi_by_facility_children.count_patients, 0),
                    khis.reporting_month,
                    latest_upload.LatestDateUploaded,
                    coalesce (PaedsTXCurr_DWH,0),
                    coalesce(count_AdultsTXCurDWH,0)
            )
            select 
                distinct 
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
                sum (nupi_NotVerified) As '# MOH UPI for non-art clients',
                sum (count_patients_nupi_sent_to_dwh) As '# DWH verified & Matched',
                round(cast(sum(count_patients_nupi_sent_to_dwh) as float) / cast(sum(TXCurr_khis) as float), 2) as '% DWH verified of KHIS TXCurr',
                sum(count_children_patients_nupi_sent_to_dwh) As '# Children DWH verified & Matched',
                sum(PaedsTXCurr_DWH) As '# Children TXCurr  DWH',
                coalesce(round(cast(sum(count_children_patients_nupi_sent_to_dwh) as float) / nullif(cast(sum(PaedsTXCurr_DWH) as float), 0),2), 0) as '% Children DWH verified of Chidren TXCurr DWH',
                sum(count_adults_patients_nupi_sent_to_dwh) As '# Adults DWH verified & Matched',
                sum(AdultsTxCurr_DWH) As '# Adults TXCurr DWH' ,
                coalesce(round (cast(sum(count_adults_patients_nupi_sent_to_dwh) as float) / nullif(cast(sum(AdultsTxCurr_DWH) as float),0),2),0) As '% Adults DWH verified of Adults TXCurr DWH'
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
                LatestDateUploaded;`;

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
