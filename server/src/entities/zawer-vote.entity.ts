import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm'
import { User } from './user.entity'
import { Merchant } from './merchant.entity'

// 一人一店只能投一票，唯一约束同时承担了防刷职责
@Entity('zawer_votes')
@Unique(['userId', 'merchantId'])
export class ZawerVote {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: string

  @ManyToOne(() => Merchant, (merchant) => merchant.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant

  @Column()
  merchantId: string

  // 吐槽内容为选填，投票本身才是主体
  @Column({ type: 'text', nullable: true })
  comment: string | null

  @CreateDateColumn()
  createdAt: Date
}
