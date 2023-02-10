import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FactHTSClientTests')
export class FactHTSClientTests {
    @PrimaryColumn('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    EntryPoint: string;

    @Column('int')
    Year: number;

    @Column('int')
    month: number;

    @Column('text')
    MonthName: string;

    @Column('int')
    Tested: number;

    @Column('int')
    positive: number;

    @Column('int')
    linked: number;
}
