import { Column, Entity, PrimaryColumn } from 'typeorm';


@Entity('AggregateClientTestedAs')
export class AggregateClientTestedAs {
    @PrimaryColumn('int')
    MFLCode: number;

    @PrimaryColumn('text')
    FacilityName: string;

    @Column({ type: 'text' })
    County: string;

    @Column({ type: 'text' })
    PartnerName: string;

    @Column({ type: 'text' })
    AgencyName: string;

    @Column({ type: 'text' })
    Gender: string;

    @Column({ type: 'int' })
    year: number;

    @Column({ type: 'int' })
    month: number;

    @Column({ type: 'text' })
    SubCounty: string;

    @Column({ type: 'int' })
    Tested: number;

    @Column({ type: 'int' })
    positive: number;

    @Column({ type: 'int' })
    linked: number;
}
