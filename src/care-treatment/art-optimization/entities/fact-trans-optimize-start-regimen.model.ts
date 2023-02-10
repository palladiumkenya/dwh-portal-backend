import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_TRANS_Optimize_StartRegimen')
export class FactTransOptimizeStartRegimen {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    Subcounty: string;

    @Column('text')
    PartnerName: string;

    @Column('text')
    Agegroup: string;

    @Column('text')
    DATIM_AgeGroup: string;

    @Column('text')
    Gender: string;

    @Column('text')
    StartRegimen: string;

    @Column('text')
    StartARTMonth: string;

    @Column('int')
    StartARTYr: number;

    @Column('int')
    TXCurr: number;

    @Column('text')
    Firstregimen: string;

    @Column('text')
    PopulationType: string;

    @Column('text')
    LatestPregnancy: string;
}
