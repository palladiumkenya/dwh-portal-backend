import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_AdverseEventsClients')
export class FactTransAeClients {
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
    Gender: string;

    @Column('text')
    AgeGroup: string;

    @Column('int')
    Total: number;
}
