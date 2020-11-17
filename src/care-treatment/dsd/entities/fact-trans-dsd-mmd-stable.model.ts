import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Fact_Trans_DSD_MMD_Stable')
export class FactTransDsdMmdStable {
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
    MMDModels: number;
}
