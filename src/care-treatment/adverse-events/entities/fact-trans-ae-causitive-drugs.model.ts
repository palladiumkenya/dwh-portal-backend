import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Fact_Trans_AECausitiveDrugs')
export class FactTransAeCausativeDrugs {
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
    AdverseEventCause: string;

    @Column('int')
    Num: string;
}
