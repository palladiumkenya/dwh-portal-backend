import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateFACT_HTS_DHIS2')
export class FactHtsDhis2 {
    @PrimaryColumn('text')
    id: string;

    @Column('text')
    DHISOrgId: string;

    @Column('text')
    SiteCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    SDP: string;

    @Column('text')
    "SDP Agency": string;

    @Column('text')
    Ward: string;

    @Column('text')
    ReportMonth_Year: string;

    @Column('int')
    Tested_Total: number;

    @Column('int')
    Positive_Total: number;

}