import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateAdverseEvents')
export class AggregateAdverseEvents {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    PartnerName: string;

    @Column('text')
    AgencyName: string;

    @Column('text')
    DATIMAgeGroup: string;

    @Column('text')
    Gender: string;

    @Column('text')
    AdverseEventCause: string;

    @Column('text')
    AdverseEvent: string;

    @Column('text')
    AdverseEventActionTaken: string;

    @Column('text')
    AdverseEventRegimen: string;

    @Column('text')
    Severity: string;

    @Column('int')
    AdverseEventCount: string;
}