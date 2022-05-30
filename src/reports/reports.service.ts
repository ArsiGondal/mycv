import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/getEstimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  getEstimate(estimateDto: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make=:make', { make: estimateDto.make })
      .andWhere('model=:model', { model: estimateDto.model })
      .andWhere('lng - :lng Between -5 AND 5', { lng: estimateDto.lng })
      .andWhere('lat - :lat Between -5 AND 5', { lat: estimateDto.lat })
      .andWhere('year - :year Between -3 AND 3', { year: estimateDto.year })
      .andWhere('approves IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage: estimateDto.mileage })
      .limit(3)
      .getRawOne();
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    console.log(id);
    const report = await this.repo.findOne(id);
    if (!report) {
      throw new NotFoundException('report not found');
    }

    console.log(report);
    report.approved = approved;
    return this.repo.save(report);
  }
}
