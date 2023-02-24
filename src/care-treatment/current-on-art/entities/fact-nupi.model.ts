import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('portaldevtest.dbo.FACT_NUPI')
export class FactNUPI {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    Subcounty: string;

    @Column('text')
    CTPartner: string;

    @Column('text')
    CTAgency: string;

    @Column('text')
    Gender: string;

    @Column('text')
    DATIM_AgeGroup: string;

    @Column('int')
    NumNUPI: number;
}
