import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateTimeToART')
export class AggregateTimeToART {
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
    Gender: string;

    @Column('int')
    StartARTYearMonth: number;

    @Column('text')
    patients_startedART: string;
}
