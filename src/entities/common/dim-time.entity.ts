import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DimTime {
    @PrimaryGeneratedColumn()
    timeId: number;
    @Column({ type: 'int' })
    day: number;
    @Column({ type: 'int' })
    month: number;
    @Column({ type: 'int' })
    year: number;
    @Column({ type: 'text' })
    monthName: string;
    @Column({ type: 'datetime' })
    fullDate: Date;
}
