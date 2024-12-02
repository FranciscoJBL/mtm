import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { log } from '@/lib/logger'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    log('info', 'Health check passed')
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    log('error', 'Health check failed', { error })
    return NextResponse.json({ status: 'error', message: 'Database connection failed' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

