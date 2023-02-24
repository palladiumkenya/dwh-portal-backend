import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_OTZEnrollments')
export class FactTransOtzEnrollments {
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
    Gender: string;

    @Column('text')
    AgeGroup: string;

    @Column('text')
    ModulesPreviouslyCovered: string;

    @Column('text')
    OTZ_Orientation: string;

    @Column('text')
    OTZ_Participation: string;

    @Column('text')
    OTZ_MakingDecisions: string;

    @Column('text')
    OTZ_Transition: string;

    @Column('text')
    OTZ_Leadership: string;

    @Column('text')
    OTZ_TreatmentLiteracy: string;

    @Column('text')
    OTZ_SRH: string;

    @Column('text')
    OTZ_Beyond: string;

    @Column('text')
    SupportGroupInvolvement: string;

    @Column('text')
    Remarks: string;

    @Column('text')
    TransitionAttritionReason: string;

    @Column('date')
    OutcomeDate: Date;

    @Column('date')
    OTZEnrollmentDate: Date;

    @Column('text')
    TransferInStatus: string;

    @Column('text')
    FirstVL: string;

    @Column('date')
    FirstVLDate: Date;

    @Column('text')
    lastVL: string;

    @Column('date')
    lastVLDate: Date;

    @Column('int')
    TXCurr: number;
}