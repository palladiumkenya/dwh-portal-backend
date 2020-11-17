import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Fact_Trans_DSD_StabilityStatus')
export class FactTransDsdStabilityStatus {
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
    Subcounty: string;

    @Column('text')
    CTPartner: string;

    @Column('int')
    Stability: number;
}
