import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_CT_TimeToFirstVL_Grp')
export class FactCTTimeToFirstVL {
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
    StartART_Year: number;

    @Column('text')
    TimeToFirstVL_Grp: string;

    @Column('int')
    NumPatients: number;

    @Column('int')
    TotalBySite: number;

    @Column('int')
    proportions: number;
}
