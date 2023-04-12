import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateAppointments')
export class AggregateAppointments {
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
    DATIMAgeGroup: string;

    @Column('text')
    Gender: string;

    @Column('text')
    AppointmentStatus: string;

    @Column('text')
    NumOfPatients: string;

    @Column('text')
    AsOfDate: string;
}
