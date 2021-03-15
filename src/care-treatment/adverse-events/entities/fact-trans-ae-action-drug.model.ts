import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_AEActionDrug')
export class FactTransAeActionDrug {
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
    AdverseEventCause_Total: number;

    @Column('text')
    AdverseEventActionTaken: string;
}
