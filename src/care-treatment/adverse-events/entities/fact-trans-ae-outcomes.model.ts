import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Fact_Trans_AEOutcomes')
export class FactTransAeOutcomes {
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
    Num: number;
}
