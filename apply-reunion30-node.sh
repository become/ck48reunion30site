#!/bin/bash
# 在 Mac 的 reunion30-node 目錄執行此 script
# Usage: cd ~/reunion30-node && bash ~/ck48reunion30site/apply-reunion30-node.sh

set -e
cd "$(dirname "$0")/../reunion30-node" 2>/dev/null || cd ~/reunion30-node

echo "📁 Working in: $(pwd)"

# ── src/config.ts ──────────────────────────────────────────
cat > src/config.ts << 'EOF'
export const config = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  corsOrigins: process.env.CORS_ORIGINS || '*',
  nodeEnv: process.env.NODE_ENV || 'development',
  recaptchaSecret: process.env.RECAPTCHA_SECRET || '',
}
EOF
echo "✅ src/config.ts"

# ── src/lib/recaptcha.ts ───────────────────────────────────
cat > src/lib/recaptcha.ts << 'EOF'
import { config } from '../config'

export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!config.recaptchaSecret || config.nodeEnv !== 'production') return true
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${config.recaptchaSecret}&response=${token}`,
    })
    const data = await res.json() as { success: boolean; score: number }
    return data.success && data.score >= 0.5
  } catch {
    return false
  }
}
EOF
echo "✅ src/lib/recaptcha.ts"

# ── src/routes/classes.ts ──────────────────────────────────
cat > src/routes/classes.ts << 'EOF'
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { resolveTenant } from '../lib/tenant'

export async function classesRoutes(app: FastifyInstance) {
  app.get('/api/classes', async (request, reply) => {
    const tenant = await resolveTenant(request, reply)
    if (!tenant) return
    const classes = await prisma.reunionClass.findMany({
      where: { tenantId: tenant.id },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, className: true, displayOrder: true },
    })
    return classes.map(c => ({ id: c.id.toString(), className: c.className }))
  })
}
EOF
echo "✅ src/routes/classes.ts"

# ── src/routes/stats.ts ────────────────────────────────────
cat > src/routes/stats.ts << 'EOF'
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { resolveTenant } from '../lib/tenant'

export async function statsRoutes(app: FastifyInstance) {
  app.get('/api/stats', async (request, reply) => {
    const tenant = await resolveTenant(request, reply)
    if (!tenant) return
    const [total, found] = await Promise.all([
      prisma.reunionAlumni.count({ where: { tenantId: tenant.id } }),
      prisma.reunionAlumni.count({ where: { tenantId: tenant.id, status: { not: 'NOT_FOUND' } } }),
    ])
    return { total, found }
  })
}
EOF
echo "✅ src/routes/stats.ts"

# ── src/routes/checkin.ts ──────────────────────────────────
cat > src/routes/checkin.ts << 'EOF'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { resolveTenant } from '../lib/tenant'
import { verifyRecaptcha } from '../lib/recaptcha'

const CheckinSchema = z.object({
  name: z.string().min(1).max(100),
  classId: z.string().min(1),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email().max(200).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  message: z.string().optional().nullable(),
  answers: z.record(z.unknown()).default({}),
  recaptchaToken: z.string().optional(),
})

export async function checkinRoutes(app: FastifyInstance) {
  app.post('/api/checkin', async (req, rep) => {
    const tenant = await resolveTenant(req, rep)
    if (!tenant) return

    const r = CheckinSchema.safeParse(req.body)
    if (!r.success) {
      return rep.status(400).send({ error: 'Validation failed', fields: r.error.flatten().fieldErrors })
    }
    const d = r.data

    if (!d.phone && !d.email) {
      return rep.status(400).send({ error: 'Phone or email is required' })
    }

    if (d.recaptchaToken) {
      const ok = await verifyRecaptcha(d.recaptchaToken)
      if (!ok) return rep.status(400).send({ error: 'RECAPTCHA_FAILED' })
    }

    const classId = BigInt(d.classId)
    const cls = await prisma.reunionClass.findFirst({
      where: { id: classId, tenantId: tenant.id },
    })
    if (!cls) return rep.status(400).send({ error: 'Invalid classId' })

    const alumni = await prisma.reunionAlumni.findFirst({
      where: { tenantId: tenant.id, classId, name: d.name },
    })
    if (!alumni) {
      return rep.status(404).send({ error: 'NAME_NOT_FOUND' })
    }

    const duplicate = await prisma.reunionCheckinRecord.findFirst({
      where: { tenantId: tenant.id, classId, name: d.name },
    })
    if (duplicate) {
      return rep.status(409).send({ error: 'ALREADY_SUBMITTED' })
    }

    const rec = await prisma.reunionCheckinRecord.create({
      data: {
        tenantId: tenant.id,
        classId,
        alumniId: alumni.id,
        name: d.name,
        phone: d.phone ?? null,
        email: d.email ?? null,
        location: d.location ?? null,
        message: d.message ?? null,
        answers: d.answers as Prisma.InputJsonValue,
        status: 'PENDING',
      },
    })

    return rep.status(201).send({ id: rec.id.toString(), name: rec.name, createdAt: rec.createdAt })
  })
}
EOF
echo "✅ src/routes/checkin.ts"

# ── src/server.ts ──────────────────────────────────────────
cat > src/server.ts << 'EOF'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { config } from './config'
import { tenantRoutes } from './routes/tenant'
import { checkinRoutes } from './routes/checkin'
import { newsRoutes } from './routes/news'
import { faqRoutes } from './routes/faq'
import { statsRoutes } from './routes/stats'
import { classesRoutes } from './routes/classes'

export async function buildServer() {
  const app = Fastify({
    logger: {
      level: config.nodeEnv === 'production' ? 'warn' : 'info',
    },
  })

  await app.register(cors, {
    origin: config.corsOrigins === '*' ? true : config.corsOrigins.split(','),
    methods: ['GET', 'POST', 'OPTIONS'],
  })

  await app.register(tenantRoutes)
  await app.register(checkinRoutes)
  await app.register(newsRoutes)
  await app.register(faqRoutes)
  await app.register(statsRoutes)
  await app.register(classesRoutes)

  app.get('/health', async () => ({ status: 'ok', ts: new Date().toISOString() }))

  return app
}
EOF
echo "✅ src/server.ts"

# ── prisma/schema.prisma ───────────────────────────────────
# Only patch the status line into ReunionCheckinRecord if not already present
if ! grep -q '"PENDING"' prisma/schema.prisma; then
  sed -i '' 's/answers     Json           @default("{}")/answers     Json           @default("{}")\n  status      String         @default("PENDING") @db.VarChar(20)/' prisma/schema.prisma
  echo "✅ prisma/schema.prisma (patched)"
else
  echo "⏭️  prisma/schema.prisma (already has status field)"
fi

# ── prisma/seed.ts ─────────────────────────────────────────
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const prisma = new PrismaClient()

const alumniData = JSON.parse(
  readFileSync(resolve(__dirname, 'data/alumni.json'), 'utf-8')
) as {
  classes: Array<{ classId: string; classLabel: string; members: string[] }>
}

async function main() {
  console.log('🌱 Seeding database...\n')

  const school = await prisma.reunionSchool.upsert({
    where: { code: 'ck' },
    update: {},
    create: { name: '建國高級中學', shortName: '建中', code: 'ck', city: '台北市' },
  })
  console.log(`✅ School: ${school.name}`)

  const tenant = await prisma.reunionTenant.upsert({
    where: { slug: 'ck48' },
    update: {},
    create: {
      schoolId: school.id,
      slug: 'ck48',
      graduationYear: 1996,
      reunionYear: 2026,
      subdomain: 'ck48.reunion30.tw',
      status: 'ACTIVE',
      checkinQuestions: [
        { id: 'dinner',       label: '重聚餐會（12/19）', type: 'boolean', required: true },
        { id: 'school_visit', label: '返校日（12/20）',   type: 'boolean', required: true },
      ],
    },
  })
  console.log(`✅ Tenant: ${tenant.slug}`)

  let alumniCount = 0
  for (const cls of alumniData.classes) {
    const className = cls.classId

    let reunionClass = await prisma.reunionClass.findFirst({
      where: { tenantId: tenant.id, className },
    })
    if (!reunionClass) {
      reunionClass = await prisma.reunionClass.create({
        data: {
          tenantId: tenant.id,
          className,
          displayOrder: parseInt(cls.classId) - 300,
        },
      })
    }

    for (const name of cls.members) {
      const exists = await prisma.reunionAlumni.findFirst({
        where: { tenantId: tenant.id, classId: reunionClass.id, name },
      })
      if (!exists) {
        await prisma.reunionAlumni.create({
          data: { tenantId: tenant.id, classId: reunionClass.id, name, status: 'NOT_FOUND' },
        })
        alumniCount++
      }
    }
    console.log(`  ${className}: ${cls.members.length} 人`)
  }
  console.log(`✅ Alumni: ${alumniCount} 筆新增`)

  console.log('\n🎉 Seed complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
EOF
echo "✅ prisma/seed.ts"

echo ""
echo "🎉 完成！接下來執行："
echo "  git add -A && git commit -m 'Add check-in system' && git push"
echo "  npm run build"
echo "  npx prisma db push"
echo "  npm run db:seed"
