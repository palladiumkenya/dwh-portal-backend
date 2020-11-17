import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity("FACT_Trans_AESeverity")
export class FactTransAeSeverity {
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
    Severity: string;

    @Column('int')
    Severity_Total: number;
}
