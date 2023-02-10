import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateOptimizeStartRegimens')
export class AggregateOptimizeStartRegimens {

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

    @Column('int')
    StartARTYr: number;

    @Column('int')
    TXCurr: number;

    @Column('text')
    Firstregimen: string;

}
