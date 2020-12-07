import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_AECategories')
export class FactTransAeCategories {
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
    AdverseEvent: string;

    @Column('text')
    Severity: string;

    @Column('int')
    Severity_total: number;
}
