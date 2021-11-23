import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_COVIDVaccines')
export class FactTransCovidVaccines {
    @PrimaryColumn('text')
    SiteCode: string;

    @Column('text')
    PatientID: string;

    @Column('text')
    PatientPK: string;

    @Column('text')
    VisitID: string;

    @Column('text')
    EMR: string;

    @Column('text')
    Project: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    Covid19AssessmentDate: string;

    @Column('text')
    ReceivedCOVID19Vaccine: string;

    @Column('text')
    VaccinationStatus: string;

    @Column('text')
    FirstDoseVaccineAdminstered: string;
}
