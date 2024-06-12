import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('PMTCTRRI.dbo.MissedInfantProphylaxis')
export class MissedInfantProphylaxis {
    @PrimaryColumn('text')
    id: string;
}
