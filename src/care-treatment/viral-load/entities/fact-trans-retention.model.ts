import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_Retention')
export class FactTransRetention {
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

    @Column('int')
    StartART_Year: number;

    @Column('text')
    Last12MVLResult: string;

    @Column('int')
    "3Mstatus": number;

    @Column('int')
    "6Mstatus": number;

    @Column('int')
    "12Mstatus": number;

    @Column('int')
    "18Mstatus": number;
}
