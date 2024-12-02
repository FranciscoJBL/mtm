import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
  const { roomId } = params

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      const checkRoom = async () => {
        const room = await prisma.room.findUnique({
          where: { id: roomId },
          include: { users: true }
        })

        if (room) {
          sendEvent({ userCount: room.users.length })
        }

        setTimeout(checkRoom, 1000) // Check every second
      }

      checkRoom()
    },
    cancel() {
      // Handle client disconnect
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

