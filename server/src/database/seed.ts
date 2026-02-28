import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Merchant } from '../entities/merchant.entity';
import { Review } from '../entities/review.entity';
import { Favorite } from '../entities/favorite.entity';

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'data/zawer.db',
  synchronize: true,
  entities: [User, Merchant, Review, Favorite],
});

const mockMerchants = [
  {
    id: '1',
    name: '老王火锅',
    category: '餐饮',
    address: '成都市锦江区春熙路 88 号',
    lng: 104.0817,
    lat: 30.6571,
    zawerIndex: 4.5,
    reviewCount: 128,
    phone: '028-88888888',
    businessHours: '11:00-22:00',
  },
  {
    id: '2',
    name: '张姐串串',
    category: '餐饮',
    address: '成都市武侯区科华北路 66 号',
    lng: 104.0731,
    lat: 30.6340,
    zawerIndex: 2.1,
    reviewCount: 56,
    phone: '028-66666666',
    businessHours: '17:00-02:00',
  },
  {
    id: '3',
    name: '如家快捷酒店',
    category: '住宿',
    address: '成都市青羊区人民中路 100 号',
    lng: 104.0635,
    lat: 30.6727,
    zawerIndex: 3.8,
    reviewCount: 89,
    phone: '028-77777777',
    businessHours: '24小时',
  },
  {
    id: '4',
    name: '星巴克春熙路店',
    category: '餐饮',
    address: '成都市锦江区春熙路 128 号',
    lng: 104.0825,
    lat: 30.6558,
    zawerIndex: 3.2,
    reviewCount: 45,
    phone: '028-55555555',
    businessHours: '08:00-22:00',
  },
  {
    id: '5',
    name: '成都大熊猫基地',
    category: '娱乐',
    address: '成都市成华区熊猫大道 1375 号',
    lng: 104.1469,
    lat: 30.7328,
    zawerIndex: 1.2,
    reviewCount: 2340,
    phone: '028-83510033',
    businessHours: '07:30-18:00',
  },
  {
    id: '6',
    name: '宽窄巷子停车场',
    category: '出行',
    address: '成都市青羊区宽窄巷子旁',
    lng: 104.0555,
    lat: 30.6697,
    zawerIndex: 4.8,
    reviewCount: 312,
    phone: '028-11111111',
    businessHours: '24小时',
  },
  {
    id: '7',
    name: '太古里优衣库',
    category: '购物',
    address: '成都市锦江区中纱帽街 8 号',
    lng: 104.0843,
    lat: 30.6535,
    zawerIndex: 2.8,
    reviewCount: 167,
    phone: '028-22222222',
    businessHours: '10:00-22:00',
  },
  {
    id: '8',
    name: '锦里古街小吃',
    category: '餐饮',
    address: '成都市武侯区武侯祠大街 231 号',
    lng: 104.0479,
    lat: 30.6459,
    zawerIndex: 4.2,
    reviewCount: 567,
    phone: '028-33333333',
    businessHours: '09:00-21:00',
  },
  {
    id: '9',
    name: '全季酒店天府广场店',
    category: '住宿',
    address: '成都市青羊区人民南路一段 86 号',
    lng: 104.0658,
    lat: 30.6573,
    zawerIndex: 1.8,
    reviewCount: 203,
    phone: '028-44444444',
    businessHours: '24小时',
  },
  {
    id: '10',
    name: '九眼桥酒吧街',
    category: '娱乐',
    address: '成都市锦江区九眼桥',
    lng: 104.0891,
    lat: 30.6432,
    zawerIndex: 3.9,
    reviewCount: 445,
    businessHours: '20:00-04:00',
  },
  {
    id: '11',
    name: '伊藤洋华堂',
    category: '购物',
    address: '成都市锦江区春熙路 68 号',
    lng: 104.0798,
    lat: 30.6589,
    zawerIndex: 2.3,
    reviewCount: 89,
    phone: '028-99999999',
    businessHours: '09:30-21:30',
  },
  {
    id: '12',
    name: '滴滴出行成都站',
    category: '出行',
    address: '成都市武侯区天府大道北段',
    lng: 104.0726,
    lat: 30.6345,
    zawerIndex: 3.5,
    reviewCount: 1023,
    businessHours: '24小时',
  },
];

const mockReviews = [
  {
    id: 'r1',
    merchantId: '1',
    userId: 'u1',
    userName: '美食达人小王',
    userAvatar: '',
    rating: 4.5,
    dimensionRatings: JSON.stringify({ environment: 4, service: 5, price: 4, quality: 5 }),
    content: '这家火锅味道确实不错，但是价格偏贵，人均消费比周边同类店铺高出不少。服务态度很好，环境也干净整洁。',
    images: undefined,
    likes: 23,
    createdAt: new Date('2026-02-25T10:30:00Z'),
  },
  {
    id: 'r2',
    merchantId: '1',
    userId: 'u2',
    userName: '吃货小李',
    userAvatar: '',
    rating: 4.8,
    dimensionRatings: JSON.stringify({ environment: 5, service: 5, price: 4, quality: 5 }),
    content: '排队等了一个小时，但是味道确实值得等待！锅底很香，菜品新鲜。就是价格有点小贵。',
    images: undefined,
    likes: 15,
    createdAt: new Date('2026-02-20T18:45:00Z'),
  },
  {
    id: 'r3',
    merchantId: '1',
    userId: 'u3',
    userName: '路过的游客',
    userAvatar: '',
    rating: 3.5,
    dimensionRatings: JSON.stringify({ environment: 3, service: 3, price: 4, quality: 4 }),
    content: '一般般吧，没有网上说的那么好。可能是期望太高了。',
    images: undefined,
    likes: 5,
    createdAt: new Date('2026-02-15T12:00:00Z'),
  },
  {
    id: 'r4',
    merchantId: '2',
    userId: 'u1',
    userName: '美食达人小王',
    userAvatar: '',
    rating: 2.0,
    dimensionRatings: JSON.stringify({ environment: 2, service: 2, price: 2, quality: 2 }),
    content: '串串味道不错，价格也很实惠！环境一般，但是胜在味道好。推荐牛肉串和鸡翅。',
    images: undefined,
    likes: 8,
    createdAt: new Date('2026-02-22T20:15:00Z'),
  },
  {
    id: 'r5',
    merchantId: '6',
    userId: 'u4',
    userName: '自驾游老张',
    userAvatar: '',
    rating: 4.9,
    dimensionRatings: JSON.stringify({ environment: 5, service: 5, price: 5, quality: 5 }),
    content: '停车费贵得离谱！10块钱一小时，宽窄巷子逛一圈下来停车费比吃饭还贵。强烈不推荐自驾来这里。',
    images: undefined,
    likes: 156,
    createdAt: new Date('2026-02-26T14:30:00Z'),
  },
  {
    id: 'r6',
    merchantId: '8',
    userId: 'u5',
    userName: '成都本地人',
    userAvatar: '',
    rating: 4.0,
    dimensionRatings: JSON.stringify({ environment: 4, service: 3, price: 5, quality: 4 }),
    content: '锦里的小吃价格虚高，味道也就那样。本地人根本不会来这里吃东西，都是游客在消费。',
    images: undefined,
    likes: 89,
    createdAt: new Date('2026-02-24T16:00:00Z'),
  },
  {
    id: 'r7',
    merchantId: '5',
    userId: 'u6',
    userName: '熊猫爱好者',
    userAvatar: '',
    rating: 1.0,
    dimensionRatings: JSON.stringify({ environment: 1, service: 1, price: 1, quality: 1 }),
    content: '大熊猫基地真的太棒了！门票价格合理，熊猫们都很可爱。工作人员也很友善，设施完善。强烈推荐！',
    images: undefined,
    likes: 234,
    createdAt: new Date('2026-02-27T09:00:00Z'),
  },
  {
    id: 'r8',
    merchantId: '9',
    userId: 'u7',
    userName: '商旅达人',
    userAvatar: '',
    rating: 1.5,
    dimensionRatings: JSON.stringify({ environment: 2, service: 1, price: 2, quality: 2 }),
    content: '全季酒店性价比很高，房间干净整洁，位置也很方便。前台服务态度好，早餐种类丰富。',
    images: undefined,
    likes: 12,
    createdAt: new Date('2026-02-23T08:30:00Z'),
  },
];

async function seed() {
  console.log('🌱 Starting database seed...');

  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const userRepository = AppDataSource.getRepository(User);
  const merchantRepository = AppDataSource.getRepository(Merchant);
  const reviewRepository = AppDataSource.getRepository(Review);

  console.log('🗑️  Clearing existing data...');
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.query('DELETE FROM reviews');
  await queryRunner.query('DELETE FROM favorites');
  await queryRunner.query('DELETE FROM merchants');
  await queryRunner.query('DELETE FROM users');
  await queryRunner.release();

  console.log('👤 Inserting test users...');
  const testUsers = [
    { id: 'u1', phone: '13800138000', nickname: '美食达人小王', avatar: undefined },
    { id: 'u2', phone: '13800138001', nickname: '吃货小李', avatar: undefined },
    { id: 'u3', phone: '13800138002', nickname: '路过的游客', avatar: undefined },
    { id: 'u4', phone: '13800138003', nickname: '自驾游老张', avatar: undefined },
    { id: 'u5', phone: '13800138004', nickname: '成都本地人', avatar: undefined },
    { id: 'u6', phone: '13800138005', nickname: '熊猫爱好者', avatar: undefined },
    { id: 'u7', phone: '13800138006', nickname: '商旅达人', avatar: undefined },
  ];
  const userEntities = userRepository.create(testUsers);
  await userRepository.save(userEntities);

  console.log('🏪 Inserting merchants...');
  const merchantEntities = merchantRepository.create(mockMerchants);
  await merchantRepository.save(merchantEntities);

  console.log('⭐ Inserting reviews...');
  const reviewEntities = reviewRepository.create(mockReviews);
  await reviewRepository.save(reviewEntities);

  console.log('✨ Seed completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - Users: ${testUsers.length}`);
  console.log(`   - Merchants: ${mockMerchants.length}`);
  console.log(`   - Reviews: ${mockReviews.length}`);

  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
