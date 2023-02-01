import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('LineListOVCEnrollments')
export class LineListOVCEnrollments {
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
    CTAgency: string;

    @Column('text')
    Gender: string;

    @Column('text')
    DATIMAgeGroup: string;

    @Column('date')
    OVCEnrollmentDate: Date;

    @Column('text')
    RelationshipWithPatient: string;

    @Column('text')
    EnrolledinCPIMS: string;

    @Column('text')
    EnrolledinCPIMSCleaned: string;

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

    @Column('text')
    Last12MVLResult: string;

    @Column('date')
    Last12MVLDate: Date;

    @Column('int')
    TXCurr: number;

    @Column('text')
    CurrentRegimen: string;

    @Column('text')
    LastRegimen: string;

    @Column('int')
    onMMD: number;

    @Column('text')
    ARTOutcome: string;

    @Column('int')
    EligibleVL: number;

    @Column('int')
    VLDone: number;

    @Column('int')
    VirallySuppressed: number;
}
