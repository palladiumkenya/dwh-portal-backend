import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_AECauses')
export class FactTransAeCauses {
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

    @Column('text')
    AdverseEventActionTaken: string;

    @Column('int')
    Total_AdverseEventCause: number;
}
