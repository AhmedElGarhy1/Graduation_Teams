import * as dotenv from 'dotenv';
dotenv.config();

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'gemater',
  // password: 'elgarhy',
  // password: 'root',
  database: process.env.DB_DATABASE || 'graduation_teams',
  entities: ['**/*.entity.js'],
  synchronize: process.env.ENV === 'dev' ? true : false,
  ssl: true,
};
