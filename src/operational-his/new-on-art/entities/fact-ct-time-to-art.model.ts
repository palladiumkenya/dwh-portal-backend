import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FACT_CT_TimeToART')
export class FactCtTimeToArt {
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
    StartYr: number;

    @Column('float')
    MedianTimeToARTDiagnosis_year: number;

    @Column('float')
    MedianTimeToARTDiagnosis_yearPartner: number;

    @Column('float')
    MedianTimeToARTDiagnosis_yearCounty: number;

    @Column('float')
    MedianTimeToARTDiagnosis_yearSbCty: number;

    @Column('float')
    MedianTimeToARTDiagnosis_yearFacility: number;

    @Column('float')
    MedianTimeToARTDiagnosis_YearCountyPartner: number;
}
