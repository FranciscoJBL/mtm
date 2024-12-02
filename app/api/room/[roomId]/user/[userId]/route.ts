import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { roomId: string; userId: string } }
) {
  const { roomId, userId } = params
  const { peerId } = await request.json()

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { peerId }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

