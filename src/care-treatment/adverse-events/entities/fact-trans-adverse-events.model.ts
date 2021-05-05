import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_AdverseEvents')
export class FactTransAdverseEvents {
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
    Gender: string;

    @Column('text')
    AgeGroup: string;

    @Column('int')
    AdverseEvent_Total: number;

    @Column('text')
    Severity: string;

    @Column('text')
    AdverseEventActionTaken: string;

    @Column('text')
    AdverseEvent: string;
}
