import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('LineListCovid')
export class LineListCovid {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    PartnerName: string;

    @Column('text')
    AgencyName: string;

    @Column('text')
    AgeGroup: string;

    @Column('text')
    Gender: string;

    @Column('text')
    Covid19AssessmentDateKey: string;

    @Column('text')
    ReceivedCOVID19Vaccine: string;

    @Column('text')
    DateGivenFirstDoseKey: string;

    @Column('text')
    FirstDoseVaccineAdministered: string;

    @Column('text')
    DateGivenSecondDoseKey: string;

    @Column('text')
    SecondDoseVaccineAdministered: string;

    @Column('text')
    VaccinationStatus: string;

    @Column('text')
    VaccineVerification: string;

    @Column('text')
    BoosterGiven: string;

    @Column('text')
    BoosterDose: string;

    @Column('text')
    BoosterDoseDateKey: string;

    @Column('text')
    EverCOVID19Positive: string;

    @Column('text')
    COVID19TestDateKey: string;

    @Column('text')
    PatientStatus: string;

    @Column('text')
    AdmissionStatus: string;

    @Column('text')
    AdmissionUnit: string;

    @Column('text')
    MissedAppointmentDueToCOVID19: string;

    @Column('text')
    COVID19PositiveSinceLasVisit: string;

    @Column('text')
    COVID19TestDateSinceLastVisit: string;

    @Column('text')
    PatientStatusSinceLastVisit: string;

    @Column('text')
    AdmissionStatusSinceLastVisit: string;

    @Column('text')
    AdmissionStartDateKey: string;

    @Column('text')
    AdmissionEndDateKey: string;

    @Column('text')
    AdmissionUnitSinceLastVisit: string;

    @Column('text')
    SupplementalOxygenReceived: string;

    @Column('text')
    PatientVentilated: string;

    @Column('text')
    TracingFinalOutcome: string;

    @Column('text')
    CauseOfDeath: string;
}
