import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateVLUptakeOutcome')
export class AggregateVLUptakeOutcome {
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

    @Column('int')
    StartARTYear: number;

    @Column('text')
    AgeGroup: string;

    @Column('int')
    TotalLast12MVL: number;

    @Column('text')
    Last12MVLResult: string;

    @Column('int')
    TXCurr: number;

    @Column('int')
    EligibleVL12Mnths: number;

    @Column('int')
    VLDone: number;

    @Column('int')
    VirallySuppressed: number;

    @Column('int')
    NewLast12MVLResult: number;
}
