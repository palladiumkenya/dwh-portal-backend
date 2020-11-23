import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('fact_pns_children')
export class FactPNSChildren {
    @PrimaryColumn('text')
    Mflcode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    Project: string;

    @Column('int')
    year: number;

    @Column('int')
    month: number;

    @Column('text')
    MonthName: string;

    @Column('text')
    Gender: string;

    @Column('text')
    Agegroup: string;

    @Column('int')
    ChildrenElicited: number;

    @Column('int')
    ChildTested: number;

    @Column('int')
    Positive: number;

    @Column('int')
    Linked: number;

    @Column('int')
    KnownPositive: number;
}
