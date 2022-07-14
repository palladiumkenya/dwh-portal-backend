import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_CT_DHIS2')
export class FactCtDhis2 {
    @PrimaryColumn('text')
    id: string;

    @Column('text')
    DHISOrgId: string;

    @Column('text')
    SiteCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    Ward: string;

    @Column('text')
    ReportMonth_Year: string;

    @Column('text')
    SDP: string;

    @Column('text')
    Agency: string;

    @Column('int')
    Enrolled_Total: number;

    @Column('int')
    StartedART_Total: number;

    @Column('int')
    CurrentOnART_Total: number;

    @Column('int')
    CTX_Total: number;

    @Column('int')
    OnART_12Months: number;

    @Column('int')
    NetCohort_12Months: number;

    @Column('int')
    VLSuppression_12Months: number;

    @Column('int')
    VLResultAvail_12Months: number;

    @Column('int')
    Start_ART_Under_1: number;

    @Column('int')
    Start_ART_1_9: number;

    @Column('int')
    Start_ART_10_14_M: number;

    @Column('int')
    Start_ART_10_14_F: number;

    @Column('int')
    Start_ART_15_19_M: number;

    @Column('int')
    Start_ART_15_19_F: number;

    @Column('int')
    Start_ART_20_24_M: number;

    @Column('int')
    Start_ART_20_24_F: number;

    @Column('int')
    Start_ART_25_Plus_M: number;

    @Column('int')
    Start_ART_25_Plus_F: number;

    @Column('int')
    On_ART_Under_1: number;

    @Column('int')
    On_ART_1_9: number;

    @Column('int')
    On_ART_10_14_M: number;

    @Column('int')
    On_ART_10_14_F: number;

    @Column('int')
    On_ART_15_19_M: number;

    @Column('int')
    On_ART_15_19_F: number;

    @Column('int')
    On_ART_20_24_M: number;

    @Column('int')
    On_ART_20_24_F: number;

    @Column('int')
    On_ART_25_Plus_M: number;

    @Column('int')
    On_ART_25_Plus_F: number;
}