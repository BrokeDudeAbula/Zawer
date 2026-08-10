import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity'
import { Merchant } from '../entities/merchant.entity'
import { ZawerVote } from '../entities/zawer-vote.entity'
import { Favorite } from '../entities/favorite.entity'

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'data/zawer.db',
  synchronize: true,
  entities: [User, Merchant, ZawerVote, Favorite],
})

// 不预置商家与点评：真实商家来自高德 POI，由用户在前端评分后自动建档
async function seed() {
  console.log('🌱 Starting database seed...')

  await AppDataSource.initialize()
  console.log('✅ Database connected')

  const userRepository = AppDataSource.getRepository(User)

  console.log('🗑️  Clearing existing data...')
  const queryRunner = AppDataSource.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.query('DELETE FROM zawer_votes')
  await queryRunner.query('DELETE FROM favorites')
  await queryRunner.query('DELETE FROM merchants')
  await queryRunner.query('DELETE FROM users')
  await queryRunner.release()

  console.log('👤 Inserting test users...')
  const testUsers = [
    { id: 'u1', phone: '13800138000', nickname: '美食达人小王', avatar: undefined },
    { id: 'u2', phone: '13800138001', nickname: '吃货小李', avatar: undefined },
    { id: 'u3', phone: '13800138002', nickname: '路过的游客', avatar: undefined },
    { id: 'u4', phone: '13800138003', nickname: '自驾游老张', avatar: undefined },
    { id: 'u5', phone: '13800138004', nickname: '成都本地人', avatar: undefined },
    { id: 'u6', phone: '13800138005', nickname: '熊猫爱好者', avatar: undefined },
    { id: 'u7', phone: '13800138006', nickname: '商旅达人', avatar: undefined },
  ]
  const userEntities = userRepository.create(testUsers)
  await userRepository.save(userEntities)

  console.log('✨ Seed completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Users: ${testUsers.length}`)
  console.log('   - Merchants: 0（商家由前端搜索高德 POI 并评分后自动入库）')

  await AppDataSource.destroy()
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error)
  process.exit(1)
})
