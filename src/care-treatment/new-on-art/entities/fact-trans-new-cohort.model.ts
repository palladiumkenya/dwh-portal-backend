import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Fact_Trans_New_Cohort')
export class FactTransNewCohort {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    Subcounty: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    CTAgency: string;

    @Column('text')
    FileName: string;

    @Column('text')
    fprovider: string;

    @Column('text')
    PatientPK: string;

    @Column('text')
    PatientID: string;

    @Column('text')
    Gender: string;

    @Column('text')
    DOB: string;

    @Column('text')
    MaritalStatus: string;

    @Column('datetime')
    DateConfirmedHIVPositive: Date;

    @Column('datetime')
    EnrollmentDate: Date;

    @Column('int')
    ageenrol: number;

    @Column('datetime')
    StartARTDate: Date;

    @Column('int')
    TimetoARTnrollment: number;

    @Column('int')
    TimetoARTDiagnosis: number;

    @Column('text')
    TimeToARTDiagnosis_Grp: string;

    @Column('int')
    ageARTstart: number;

    @Column('datetime')
    LastARTDate: Date;

    @Column('text')
    CurrentRegimen: string;

    @Column('datetime')
    dtLastVisit: Date;

    @Column('int')
    ageLV: number;

    @Column('datetime')
    NextAppointmentDate: Date;

    @Column('int')
    TXCurr: number;

    @Column('text')
    ARTOutcome: string;

    @Column('int')
    EligibleVL: number;

    @Column('int')
    Last12MonthVL: number;

    @Column('text')
    Last12MVLResult: string;

    @Column('text')
    Last12MVLSup: string;

    @Column('int')
    "OnART<12Months": number;

    @Column('text')
    LatestWeight: string;

    @Column('text')
    LatestHeight: string;

    @Column('text')
    Adherence: string;

    @Column('int')
    DifferentiatedCare: string;

    @Column('int')
    StabilityAssessment: string;

    @Column('text')
    FirstVL: string;

    @Column('datetime')
    FirstVLDate: Date;

    @Column('text')
    lastVL: string;

    @Column('datetime')
    lastVLDate: Date;

    @Column('int')
    Stability_Compute: number;

    @Column('int')
    onMMD: number;
}
