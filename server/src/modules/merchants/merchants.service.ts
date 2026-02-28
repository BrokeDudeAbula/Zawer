import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Merchant } from '../../entities/merchant.entity';
import { QueryMerchantsDto } from './dto/query-merchants.dto';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
  ) {}

  private parseJsonFields(merchant: Merchant): any {
    const result: any = { ...merchant };

    if (result.images && typeof result.images === 'string') {
      try {
        result.images = JSON.parse(result.images);
      } catch (e) {
        // Keep original string if parsing fails
      }
    }

    if (result.dimensionRatings && typeof result.dimensionRatings === 'string') {
      try {
        result.dimensionRatings = JSON.parse(result.dimensionRatings);
      } catch (e) {
        // Keep original string if parsing fails
      }
    }

    return result;
  }

  private calculateDistance(
    lng1: number,
    lat1: number,
    lng2: number,
    lat2: number,
  ): number {
    const R = 6371000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  async getList(query: QueryMerchantsDto) {
    const { page, pageSize, category, zawerMin, zawerMax, lng, lat, distance } = query;

    const queryBuilder = this.merchantRepository.createQueryBuilder('merchant');

    if (category) {
      queryBuilder.andWhere('merchant.category = :category', { category });
    }

    if (zawerMin !== undefined) {
      queryBuilder.andWhere('merchant.zawerIndex >= :zawerMin', { zawerMin });
    }

    if (zawerMax !== undefined) {
      queryBuilder.andWhere('merchant.zawerIndex <= :zawerMax', { zawerMax });
    }

    const [merchants, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    let filteredMerchants = merchants.map(this.parseJsonFields);

    if (lng !== undefined && lat !== undefined && distance !== undefined) {
      filteredMerchants = filteredMerchants.filter((merchant) => {
        const dist = this.calculateDistance(lng, lat, merchant.lng, merchant.lat);
        return dist <= distance;
      });
    }

    return {
      list: filteredMerchants,
      total,
      page,
      pageSize,
    };
  }

  async getById(id: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({ where: { id } });
    if (!merchant) {
      throw new NotFoundException(`Merchant with id ${id} not found`);
    }
    return this.parseJsonFields(merchant);
  }

  async search(keyword: string): Promise<Merchant[]> {
    const merchants = await this.merchantRepository.find({
      where: [
        { name: Like(`%${keyword}%`) },
        { address: Like(`%${keyword}%`) },
      ],
    });
    return merchants.map(this.parseJsonFields);
  }
}
