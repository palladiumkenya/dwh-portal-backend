import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FactHtsuptake {
    @PrimaryColumn('text')
    FacilityName: string;

    @Column({ type: 'text' })
    County: string;

    @Column({ type: 'text' })
    CTPartner: string;

    @Column({ type: 'int' })
    year: number;

    @Column({ type: 'int' })
    month: number;

    @Column({ type: 'text' })
    MonthName: string;

    @Column({ type: 'int' })
    Tested: number;

    @Column({ type: 'int' })
    positive: number;

    @Column({ type: 'int' })
    linked: number;
}
