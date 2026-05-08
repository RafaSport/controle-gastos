import 'dotenv/config'
import { defineConfig } from '@prisma/config'

// Configuração central do Prisma 7 — URL e seed ficam aqui
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})