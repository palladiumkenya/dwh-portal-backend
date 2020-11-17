import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_CT_TimeToART_Grp')
export class FactCTTimeToArt {
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

    @Column('int')
    StartART_Month: number;

    @Column('text')
    TimeToARTDiagnosis_Grp: string;

    @Column('int')
    NumPatients: string;
}
