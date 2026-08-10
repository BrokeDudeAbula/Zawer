import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ZawerVote } from './zawer-vote.entity'

@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true, nullable: true })
  amapPoiId: string | null

  @Column()
  name: string

  @Column()
  category: string

  @Column()
  address: string

  @Column({ type: 'float' })
  lng: number

  @Column({ type: 'float' })
  lat: number

  // 被多少人点过 Zawer，数值越大越坑
  @Column({ type: 'int', default: 0 })
  zawerCount: number

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  businessHours: string

  @Column({ type: 'text', nullable: true })
  images: string

  @OneToMany(() => ZawerVote, (vote) => vote.merchant)
  votes: ZawerVote[]
}
