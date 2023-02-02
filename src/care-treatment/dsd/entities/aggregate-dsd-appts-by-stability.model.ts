import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AggregateDSDApptsByStability')
export class AggregateDSDApptsByStability {
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
    AgeGroup: string;

    @Column('int')
    StabilityAssessment: number;

    @Column('text')
    AppointmentsCategory: string;

    @Column('text')
    Stability: string;
    
    @Column('int')
    patients_number: number;
    
}
