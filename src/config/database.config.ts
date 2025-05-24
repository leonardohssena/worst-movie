import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  seedDb: process.env.SEED_DB === 'true',
  seedCsvMovieFileName: process.env.SEED_CSV_MOVIE_FILE_NAME,
}))
