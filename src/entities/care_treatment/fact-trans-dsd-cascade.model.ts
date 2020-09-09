import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_DSD_Cascade')
export class FactTransDsdCascade {
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
    TXCurr: number;

    @Column('int')
    Stability: number;

    @Column('int')
    OnMMD: number;
}
