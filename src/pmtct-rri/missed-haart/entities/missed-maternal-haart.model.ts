import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('PMTCTRRI.dbo.MissedMaternalHaart')
export class MissedMaternalHaart {
    @PrimaryColumn('text')
    id: string;
}
