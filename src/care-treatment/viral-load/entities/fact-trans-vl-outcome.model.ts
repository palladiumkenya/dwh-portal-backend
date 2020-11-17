import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_VL_Outcome')
export class FactTransVLOutcome {
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
    StartART_Year: number;

    @Column('text')
    Last12MVLResult: string;

    @Column('int')
    Total_Last12MVL: number;
}
