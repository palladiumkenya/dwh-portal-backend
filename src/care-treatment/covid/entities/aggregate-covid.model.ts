import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateCovid')
export class AggregateCovid {
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
    AgeGroup: string;

    @Column('text')
    Gender: string;

    @Column('text')
    PatientStatus: string;

    @Column('text')
    VaccinationStatus: string;

    @Column('text')
    AdmissionStatus: string;

    @Column('text')
    AdmissionUnit: string;

    @Column('text')
    EverCOVID19Positive: string;

    @Column('text')
    MissedAppointmentDueToCOVID19: string;

    @Column('int')
    adults_count: number;
}
