import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from './review.entity';

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  address: string;

  @Column({ type: 'float' })
  lng: number;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float', default: 3.0 })
  zawerIndex: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  businessHours: string;

  @Column({ type: 'text', nullable: true })
  images: string;

  @Column({ type: 'text', nullable: true })
  dimensionRatings: string;

  @OneToMany(() => Review, (review) => review.merchant)
  reviews: Review[];
}
