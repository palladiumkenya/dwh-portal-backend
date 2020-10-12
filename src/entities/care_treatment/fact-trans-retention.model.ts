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
    Subcounty: string;

    @Column('text')
    CTPartner: string;

    @Column('int')
    Start_Year: number;

    @Column('int')
    "3Mstatus": number;

    @Column('int')
    "6Mstatus": number;

    @Column('int')
    "12Mstatus": number;

    @Column('int')
    "18Mstatus": number;
}
