import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('PMTCTRRI.dbo.MissedEIDTesting')
export class MissedEIDTesting {
    @PrimaryColumn('text')
    id: string;
}
