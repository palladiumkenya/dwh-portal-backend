import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity("dim_emr")
export class DimEmr {
    @PrimaryColumn('text')
    emrId: string;
    @Column({ type: 'text' })
    name: string;
}
