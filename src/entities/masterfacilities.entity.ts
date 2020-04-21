import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('masterfacilities')
export class MasterfacilitiesEntity {
    @PrimaryColumn()
    Id: number;

    @Column({ nullable: true })
    Name: string;

    @Column({ nullable: true })
    County: string;
}
