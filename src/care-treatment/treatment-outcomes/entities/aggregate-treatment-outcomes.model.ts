import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateTreatmentOutcomes')
export class AggregateTreatmentOutcomes {
    @PrimaryColumn('text')
    MFLCode: string;

    @Column('text')
    FacilityName: string;

    @Column('text')
    County: string;

    @Column('text')
    Subcounty: string;

    @Column('text')
    PartnerName: string;

    @Column('text')
    Gender: string;

    @Column('text')
    ageGroup: string;

    @Column('int')
    StartYear: number;

    @Column('int')
    StartMonth: number;

    @Column('text')
    ARTOutcomeDescription: string;

    @Column('int')
    TotalOutcomes: number;
}
