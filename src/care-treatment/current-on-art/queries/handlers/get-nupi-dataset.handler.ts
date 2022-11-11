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
        const txCurrByPartner =
                `with facilities_list as (
                    select
                        distinct
                        [Facility Name] AS FacilityName,
                        MFL_Code As MFLCode,
                        County,
                        SDP,
                        EMR,
                        [SDP Agency]
                    from HIS_Implementation.dbo.All_EMRSites
                    where [EMR Status] = 'Active'
                ),
                latest_reporting_month as (
                    select
                        SiteCode,
                        max(ReportMonth_Year) as reporting_month
                    from PortalDev.dbo.FACT_CT_DHIS2 as khis
                    where CurrentOnART_Total is not null
                        and (select max(cast(ReportMonth_Year as int)) from PortalDev.dbo.FACT_CT_DHIS2)  - cast(ReportMonth_Year as int) <= 6
                    group by SiteCode
                ),
                khis as (
                    select
                        khis.SiteCode,
                        latest_reporting_month.reporting_month,
                        sum(CurrentOnART_Total) as TXCurr_khis
                    from PortalDev.dbo.FACT_CT_DHIS2 as khis
                    inner join latest_reporting_month on latest_reporting_month.SiteCode = khis.SiteCode
                        and khis.ReportMonth_Year = latest_reporting_month.reporting_month
                    group by
                        khis.SiteCode,
                        latest_reporting_month.reporting_month
                ),
                missing_ccc_nos as (
                    select
                        origin_facility_kmfl_code as facility_code,
                        count(*) as count_missing_ccc
                    from tmp_and_adhoc.dbo.nupi_dataset as nupi_dataset
                    where ccc_no is null
                    group by origin_facility_kmfl_code
                ),
                With_ccc_nos as (
                    select
                        origin_facility_kmfl_code as facility_code,
                        count(*) as count_with_CCC_CR
                    from tmp_and_adhoc.dbo.nupi_dataset as nupi_dataset
                    where ccc_no is not null
                    group by origin_facility_kmfl_code
                ),
                nupi as (
                select
                    distinct PatientID as client_upn,
                    replace(ccc_no, '-' , '') as nupi_no,
                    MFLCode
                from tmp_and_adhoc.dbo.nupi_dataset as nupi_dataset
                inner join portalDevTest.dbo.Fact_Trans_New_Cohort as cohort on replace(nupi_dataset.ccc_no, '-' , '') = cohort.PatientID
                    and nupi_dataset.origin_facility_kmfl_code = cohort.MFLCode
                ),
                nupi_by_facility as (
                select
                        MFLCode,
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
                dwh_nupi_by_facility as (
                    select
                        MFLCode,
                        sum ( NumNUPI) as count_patients
                    from PortalDevTest.dbo.FACT_NUPI
                    group by
                        MFLCode
                ),
                dwh_nupi_by_facility_children as (
                    select
                        MFLCode,
                        sum ( Children) as count_patients
                    from PortalDevTest.dbo.FACT_NUPI(nolock)
                    group by
                        MFLCode
                ),
                dwh_nupi_by_facility_adults as (
                    select
                        MFLCode,
                        sum (Adults) as count_patients
                    from PortalDevTest.dbo.FACT_NUPI (nolock)
                    group by
                        MFLCode
                ),
                dwh_by_facility_adults as (
                    select
                        MFLCode,
                        count(distinct concat(Patientid, PatientPK, MFLCode)) as count_AdultsTXCurDWH
                    from PortalDev.dbo.Fact_Trans_New_Cohort (nolock)
                    where  ARTOutcome ='V' and ageLV >= 18 and ageLV <= 120
                    group by
                        MFLCode
                ),
                latest_upload as (
                    select
                            t.SiteCode,
                            max(cast(t.DateRecieved as date)) as LatestDateUploaded
                    from DWAPICentral.dbo.FacilityManifest(NoLock) t
                    group by t.[SiteCode]
                ),
                Children As (
                    select
                        MFLCode,
                        count(distinct concat(Patientid, PatientPK, MFLCode)) as count_Paeds
                    from PortalDev.dbo.Fact_Trans_New_Cohort (nolock)
                    where  ARTOutcome ='V' and ageLV < 18
                    group by
                        MFLCode
                ),
                Grouping_Paeds As (
                Select
                        MFLcode,
                        sum (count_Paeds) As PaedsTXCurr_DWH
                from Children
                group by
                        MFLcode
                ),
                FacilitySummary AS (
                select
                    facilities_list.FacilityName as Facility,
                    facilities_list.MFLCode as MFLCode,
                    facilities_list.SDP as SDIP,
                    facilities_list.EMR as EMR,
                    facilities_list.County as County,
                    facilities_list.[SDP Agency] as Agency,
                    khis.reporting_month as khis_reporting_month,
                    latest_upload.LatestDateUploaded as LatestDateUploaded,
                    sum(TXCurr_khis) as TXCurr_khis,
                    coalesce(sum(clients_with_nupi), 0) as clients_with_nupi_from_MoH,
                    coalesce(round(cast(sum(clients_with_nupi) as float) / cast(sum(TXCurr_khis) as float), 2), 0) as proportion_of_KHIS_with_nupi_no_from_MoH,
                    coalesce(nupi_by_facility.count_missing_ccc, 0) as missing_ccc_from_MoH,
                    coalesce (nupi_by_facility.count_with_CCC_CR,0) As With_ccc_MoH,
                    coalesce(dwh_nupi_by_facility.count_patients, 0) as count_patients_nupi_sent_to_dwh,
                    coalesce(round(sum(cast(dwh_nupi_by_facility.count_patients as float)) / cast(sum(TXCurr_khis) as float), 2), 0)  as proportion_of_KHIS_with_nupi_no_sent_to_dwh,
                    coalesce(dwh_nupi_by_facility_adults.count_patients, 0) as count_adults_patients_nupi_sent_to_dwh,
                    coalesce(dwh_nupi_by_facility_children.count_patients, 0) as count_children_patients_nupi_sent_to_dwh,
                    coalesce(round(cast(sum(dwh_nupi_by_facility_adults.count_patients) as float)/cast(sum(dwh_nupi_by_facility.count_patients) as float), 2), 0)  as proportion_of_adults_with_nupi_sent_to_dwh,
                    coalesce(round(cast(sum(dwh_nupi_by_facility_children.count_patients) as float)/cast(sum(dwh_nupi_by_facility.count_patients) as float),2), 0) as proportion_of_children_with_nupi_sent_to_dwh,
                    coalesce(PaedsTXCurr_DWH,0) As PaedsTXCurr_DWH,
                    coalesce (count_AdultsTXCurDWH,0) As AdultsTxCurr_DWH
                from facilities_list
                left join khis on khis.SiteCode = facilities_list.MFLCode collate Latin1_General_CI_AS
                left join nupi_by_facility on nupi_by_facility.MFLCode = facilities_list.MFLCode
                left join dwh_nupi_by_facility on dwh_nupi_by_facility.MFLCode = facilities_list.MFLCode
                left join dwh_nupi_by_facility_adults on dwh_nupi_by_facility_adults.MFLCode = facilities_list.MFLCode
                left join dwh_nupi_by_facility_children on dwh_nupi_by_facility_children.MFLCode = facilities_list.MFLCode
                left join latest_upload on latest_upload.SiteCode = facilities_list.MFLCode
                left join Grouping_Paeds on Grouping_Paeds.MFLCode=facilities_list.MFLCode
                left join dwh_by_facility_adults on dwh_by_facility_adults.MFLCode = facilities_list.MFLCode
                group by
                    facilities_list.FacilityName,
                    facilities_list.MFLCode,
                    facilities_list.SDP,
                    facilities_list.EMR,
                    facilities_list.County,
                    facilities_list.[SDP Agency],
                    coalesce(nupi_by_facility.count_missing_ccc, 0),
                    coalesce(nupi_by_facility.count_with_CCC_CR, 0),
                    dwh_nupi_by_facility.count_patients,
                    coalesce(dwh_nupi_by_facility_adults.count_patients, 0),
                    coalesce(dwh_nupi_by_facility_children.count_patients, 0),
                    khis.reporting_month,
                    latest_upload.LatestDateUploaded,
                    coalesce (PaedsTXCurr_DWH,0),
                    coalesce(count_AdultsTXCurDWH,0)
                )
                select
                    getdate() as DateQueried,
                    MFLCode,
                    Facility,
                    SDIP as Partner,
                    Agency,
                    EMR,
                    County,
                    LatestDateUploaded,
                    khis_reporting_month as 'KHIS TXCurr Latest Reporting Month',
                    LatestDateUploaded,
                    sum(With_ccc_MoH + missing_ccc_from_MoH) as '# Total Verified Central Registry',
                    sum(missing_ccc_from_MoH) As '# without CCC No. Central Registry',
                    sum(With_ccc_MoH) As '# with CCC No. Central Registry',
                    sum(TXCurr_khis) AS 'KHIS TXCurr (EMR Sites)',
                    sum (clients_with_nupi_from_MoH) As '# MOH Central Registry Verified (EMR Sites)',
                    coalesce(round(cast(sum(clients_with_nupi_from_MoH) as float) / cast(sum(TXCurr_khis) as float), 2), 0) as '% MOH Central Registry verified of KHIS TXCurr',
                    sum (count_patients_nupi_sent_to_dwh) As '# DWH verified & Matched',
                    round(cast(sum(count_patients_nupi_sent_to_dwh) as float) / cast(sum(TXCurr_khis) as float), 2) as '% DWH verified of KHIS TXCurr',
                    sum(count_children_patients_nupi_sent_to_dwh) As '# Children DWH verified & Matched',
                    sum(PaedsTXCurr_DWH) As	'# Children TXCurr  DWH',
                    coalesce(round(cast(sum(count_children_patients_nupi_sent_to_dwh) as float) / nullif(cast(sum(PaedsTXCurr_DWH) as float), 0),2), 0) as '% Children DWH verified of Chidren TXCurr DWH',
                    sum(count_adults_patients_nupi_sent_to_dwh) As '# Adults DWH verified & Matched',
                    sum(AdultsTxCurr_DWH) As '# Adults TXCurr DWH' ,
                    coalesce(round (cast(sum(count_adults_patients_nupi_sent_to_dwh) as float) / nullif(cast(sum(AdultsTxCurr_DWH) as float),0),2),0) As '% Adults DWH verified of Adults TXCurr DWH'  
                from FacilitySummary
                group by
                    Facility,
                    MFLCode,
                    SDIP,
                    EMR,
                    County,
                    Agency,
                    khis_reporting_month,
                    LatestDateUploaded`;

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

        return this.repository.query(txCurrByPartner, params);
    }
}
