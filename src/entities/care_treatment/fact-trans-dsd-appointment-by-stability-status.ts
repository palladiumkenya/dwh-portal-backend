import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Fact_Trans_DSD_ApptsbyStabilityStatus')
export class FactTransDsdAppointmentByStabilityStatus {
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

    @Column('int')
    AppointmentinMonths: number;

    @Column('text')
    AppointmentsCategory: string;

    @Column('text')
    Stability: string;

    @Column('int')
    NumPatients: number;
}
