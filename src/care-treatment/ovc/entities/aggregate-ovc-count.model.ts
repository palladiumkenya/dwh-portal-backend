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
    PartnerName: string;

    @Column('text')
    AgencyName: string;

    @Column('text')
    Gender: string;

    @Column('text')
    DATIMAgeGroup: string;

    @Column('text')
    ARTOutcomeDescription: string;

    @Column('int')
    TXCurr: number;

    @Column('int')
    OVCEligiblePatientCount: number;
}
