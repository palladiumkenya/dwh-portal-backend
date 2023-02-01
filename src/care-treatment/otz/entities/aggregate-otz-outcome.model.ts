import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateOTZOutcome')
export class AggregateOTZOutcome {
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
    AgeGroup: string;

    @Column('text')
    OTZEnrollmentYearMonth: string;

    @Column('text')
    Outcome: string;

    @Column('int')
    patients_totalOutcome: number;
}