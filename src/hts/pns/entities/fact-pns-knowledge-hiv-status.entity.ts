import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('fact_pns_knowledgehivstatus')
export class FactPNSKnowledgeHivStatus {
    @PrimaryColumn('text')
    Mflcode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    subcounty: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    project: string;

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
    ContactElicited: number;

    @Column('int')
    ContactTested: number;

    @Column('int')
    Positive: number;

    @Column('int')
    Linked: number;

    @Column('int')
    KnownPositive: number;

    @Column('int')
    NewNegatives: number;

    @Column('int')
    NewPositives: number;

    @Column('int')
    UnknownStatus: number;
}
