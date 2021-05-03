import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_TRANS_Optimize_RegLines')
export class FactTransOptimizeRegLines {
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

    @Column('text')
    Agegroup: string;

    @Column('text')
    DATIM_AgeGroup: string;

    @Column('text')
    Gender: string;

    @Column('text')
    CurrentRegimen: string;

    @Column('int')
    TXCurr: number;

    @Column('text')
    Lastregimen: string;

    @Column('text')
    LastRegimenClean: string;

    @Column('text')
    RegimenLine: string;

    @Column('text')
    PopulationType: string;

    @Column('text')
    LatestPregnancy: string;
}
