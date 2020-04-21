import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manifest } from '../entities/manifest.entity';
import { Repository } from 'typeorm';
import { MasterfacilitiesEntity } from '../entities/masterfacilities.entity';

@Injectable()
export class ReportingRatesService {
    constructor(
        @InjectRepository(Manifest) private manifestRepo: Repository<Manifest>,
        @InjectRepository(MasterfacilitiesEntity)
        private masterfacilitiesRepo: Repository<MasterfacilitiesEntity>,
    ) {}

    async getCounties() {
        try {
            let counties = await this.masterfacilitiesRepo.query(
                'SELECT DISTINCT `County` FROM `masterfacilities` ORDER BY `County` ASC',
            );
            counties = counties.filter(
                obj =>
                    obj.County != ' Tech & Technologists Board' &&
                    obj.County != 'Kenya Radiation Protection Board',
            );
            return counties;
        } catch (e) {}
    }
}
