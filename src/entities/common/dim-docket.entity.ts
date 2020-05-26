import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity("dim_docket")
export class DimDocket {
    @PrimaryColumn('text')
    docketId: string;
    @Column({ type: 'text' })
    name: string;
}
