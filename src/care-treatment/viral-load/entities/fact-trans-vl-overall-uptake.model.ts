import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_VL_OverallUptake')
export class FactTransVLOverallUptake {
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
    TXCurr: number;

    @Column('int')
    EligibleVL12Mnths: number;

    @Column('int')
    VLDone: number;

    @Column('int')
    VirallySuppressed: number;
}
