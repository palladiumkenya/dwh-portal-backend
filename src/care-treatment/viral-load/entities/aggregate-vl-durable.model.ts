import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateLDLDurable')
export class AggregateVLDurable {
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
    ValidVLResultCategory: string;

    @Column('int')
    PBFWCategory: number;

    @Column('text')
    AgeGroup: string;

    @Column('int')
    TXCurr: number;

    @Column('int')
    EligibleVL: number;

    @Column('int')
    HasValidVL: number;

    @Column('int')
    CountEligibleForTwoVLTests: number;

    @Column('int')
    CountTwoConsecutiveTestsWithinTheYear: number;

    @Column('int')
    DurableLDL: number;
}
