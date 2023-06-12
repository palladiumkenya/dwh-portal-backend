import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateOTZ')
export class AggregateOtz {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    AgencyName: string;

    @Column('text')
    Gender: string;

    @Column('text')
    AgeGroup: string;

    @Column('text')
    OTZEnrollmentYearMonth: string;

    @Column('int')
    Enrolled: number;

    @Column('int')
    CompletedTraining: number;

    @Column('text')
    TransferInStatus: string;

    @Column('text')
    ModulesPreviouslyCovered: string;

    @Column('int')
    CompletedToday_OTZ_Orientation: number;

    @Column('int')
    CompletedToday_OTZ_Participation: number;

    @Column('int')
    CompletedToday_OTZ_Leadership: number;

    @Column('int')
    CompletedToday_OTZ_MakingDecisions: number;

    @Column('int')
    CompletedToday_OTZ_Transition: number;

    @Column('int')
    CompletedToday_OTZ_TreatmentLiteracy: number;

    @Column('int')
    CompletedToday_OTZ_SRH: number;

    @Column('int')
    CompletedToday_OTZ_Beyond: number;

    @Column('text')
    FirstVL: string;

    @Column('text')
    LastVL: string;

    @Column('int')
    EligibleVL: number;

    @Column('date')
    Last12MonthVLResults: Date;

    @Column('text')
    Last12MVLResult: string;

    @Column('int')
    Last12MonthVL: number;

    @Column('int')
    TotalOTZ: number;
}