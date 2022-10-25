import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Prep')
export class FactPrep {
    @PrimaryColumn('text')
    PrepNumber: string;

    @Column('text')
    PatientPk: string;

    @Column('text')
    Project: string;

    @Column('text')
    DateExtracted: string;

    @Column('text')
    SiteCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    Emr: string;

    @Column('text')
    PrepEnrollmentDate: string;

    @Column('text')
    Sex: string;

    @Column('text')
    DateofBirth: string;

    @Column('text')
    County: string;

    @Column('text')
    ReferralPoint: string;

    @Column('text')
    MaritalStatus: string;

    @Column('text')
    TransferIn: string;

    @Column('text')
    PopulationType: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    VisitMonth: string;

    @Column('text')
    VisitYear: string;

    @Column('text')
    STIScreening: string;

    @Column('text')
    STISymptoms: string;

    @Column('text')
    STITreated: string;

    @Column('text')
    Circumcised: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    CTAgency: string;

    @Column('text')
    EntryPoint: string;

    @Column('int')
    MFLCode: number;

    @Column('int')
    Year: number;

    @Column('int')
    month: number;

    @Column('text')
    MonthName: string;

    @Column('int')
    Tested: number;

    @Column('int')
    positive: number;

    @Column('int')
    linked: number;
}
