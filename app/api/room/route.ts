import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Find a room with one user or create a new room
    let room = await prisma.room.findFirst({
      where: {
        users: {
          some: {},
          none: {
            roomId: null
          }
        }
      },
      include: { users: true }
    })

    if (!room || room.users.length >= 2) {
      room = await prisma.room.create({
        data: {},
        include: { users: true }
      })
    }

    // Create a new user and add them to the room
    const user = await prisma.user.create({
      data: {
        roomId: room.id
      }
    })

    return NextResponse.json({ roomId: room.id, userId: user.id })
  } catch (error) {
    console.error('Error creating/joining room:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

