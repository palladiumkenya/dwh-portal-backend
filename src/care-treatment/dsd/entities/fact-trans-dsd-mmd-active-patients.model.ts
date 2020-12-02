import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_DSD_MMD_ActivePatients')
export class FactTransDsdMmdActivePatients {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    Gender: string;

    @Column('text')
    DATIM_AgeGroup: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    CTPartner: string;

    @Column('int')
    Differentiatedcare: number;

    @Column('int')
    TXCurr: number;

    @Column('int')
    MMDModels: number;
}
