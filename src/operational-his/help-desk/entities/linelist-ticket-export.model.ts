import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('LinelistTicketExport')
export class LinelistTicketExport {
    @PrimaryColumn('text')
    id: string;

}