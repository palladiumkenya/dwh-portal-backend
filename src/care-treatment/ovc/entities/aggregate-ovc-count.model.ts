import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateOVCCount')
export class AggregateOVCCount {
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
    CTAgency: string;

    @Column('text')
    Gender: string;

    @Column('text')
    DATIMAgeGroup: string;

    @Column('text')
    ARTOutcome: string;

    @Column('int')
    TXCurr: number;

    @Column('int')
    OVCEligiblePatientCount: number;
}
