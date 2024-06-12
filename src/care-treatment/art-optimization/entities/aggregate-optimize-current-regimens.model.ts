import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateOptimizeCurrentRegimens')
export class AggregateOptimizeCurrentRegimens {
    @PrimaryColumn('text')
    SiteCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    Subcounty: string;

    @Column('text')
    PartnerName: string;

    @Column('text')
    AgencyName: string;

    @Column('text')
    Agegroup: string;

    @Column('text')
    DATIMAgeGroup: string;

    @Column('text')
    Gender: string;

    @Column('text')
    StartRegimen: string;

    @Column('text')
    StartARTMonth: string;

    @Column('text')
    StartARTYr: string;

    @Column('text')
    CurrentRegimen: string;

    @Column('int')
    TXCurr: number;

    @Column('text')
    RegimenLine: string;

    @Column('text')
    WeightBands: string;

    @Column('text')
    AgeBands: string;
}
