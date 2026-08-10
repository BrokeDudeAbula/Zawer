import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm'
import { ZawerVote } from './zawer-vote.entity'
import { Favorite } from './favorite.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  phone: string

  @Column()
  nickname: string

  @Column({ nullable: true })
  avatar: string

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(() => ZawerVote, (vote) => vote.user)
  votes: ZawerVote[]

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[]
}
