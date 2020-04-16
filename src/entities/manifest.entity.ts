import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('manifests')
export class Manifest {
    @PrimaryColumn()
    Id: number;

    @Column()
    SiteCode: number;

    @Column({ nullable: true })
    Name: string;

    @Column()
    Sent: number;

    @Column()
    Recieved: number;

    @Column()
    DateLogged: Date;

    @Column()
    DateArrived: Date;

    @Column()
    Status: number;

    @Column()
    StatusDate: Date;

    @Column({ length: 64 })
    FacilityId: string;
}
