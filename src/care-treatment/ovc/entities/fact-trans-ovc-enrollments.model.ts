import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_OVCEnrollments')
export class FactTransOvcEnrollments {
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
    DATIM_AgeGroup: string;

    @Column('date')
    OVCEnrollmentDate: Date;

    @Column('text')
    RelationshipToClient: string;

    @Column('text')
    EnrolledinCPIMS: string;

    @Column('text')
    CPIMSUniqueIdentifier: string;

    @Column('text')
    PartnerOfferingOVCServices: string;

    @Column('text')
    OVCExitReason: string;

    @Column('date')
    ExitDate: Date;

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