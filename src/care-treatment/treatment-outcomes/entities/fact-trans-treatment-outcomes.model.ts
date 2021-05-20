import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Fact_Trans_TreatmentOutcomes')
export class FactTransTreatmentOutcomes {
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
    Gender: string;

    @Column('text')
    ageGroup: string;

    @Column('int')
    StartYear: number;

    @Column('int')
    StartMonth: number;

    @Column('text')
    ARTOutcome: string;

    @Column('int')
    TotalOutcomes: number;
}
