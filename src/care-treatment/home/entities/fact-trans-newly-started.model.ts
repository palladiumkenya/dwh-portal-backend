import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_Newly_Started')
export class FactTransNewlyStarted {
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
    StartART_Month: number;

    @Column('int')
    StartedART: number;

    @Column('text')
    Gender: string;

    @Column('text')
    AgeGroup: string;
}
