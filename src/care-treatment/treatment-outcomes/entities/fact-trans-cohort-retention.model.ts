import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_Trans_CohortRetention')
export class FactTransCohortRetention {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    SubCounty: string;

    @Column('text')
    CTPartner: string;

    @Column('int')
    StartART_Year: number;

    @Column('int')
    StartARTMonth: number;

    @Column('int')
    M3Retained: number;

    @Column('int')
    M3NetCohort: number;

    @Column('int')
    M6Retained: number;

    @Column('int')
    M6NetCohort: number;

    @Column('int')
    M12Retained: number;

    @Column('int')
    M12NetCohort: number;

    @Column('int')
    M18Retained: number;

    @Column('int')
    M18NetCohort: number;
}