import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Remove users that haven't updated their peerId in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    await prisma.user.deleteMany({
      where: {
        updatedAt: {
          lt: fiveMinutesAgo
        }
      }
    })

    // Remove empty rooms
    await prisma.room.deleteMany({
      where: {
        users: {
          none: {}
        }
      }
    })

    return NextResponse.json({ message: 'Cleanup completed successfully' })
  } catch (error) {
    console.error('Error during cleanup:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

