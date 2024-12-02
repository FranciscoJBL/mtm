'use client'

import { useState, useEffect } from 'react'
import { P2PChat } from '@/components/p2p-chat'

export default function Home() {
  const [roomId, setRoomId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userCount, setUserCount] = useState<number>(0)

  useEffect(() => {
    const joinRoom = async () => {
      const response = await fetch('/api/room')
      const data = await response.json()
      setRoomId(data.roomId)
      setUserId(data.userId)
    }

    joinRoom()
  }, [])

  useEffect(() => {
    if (roomId) {
      const eventSource = new EventSource(`/api/room/${roomId}/events`)

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setUserCount(data.userCount)
      }

      return () => {
        eventSource.close()
      }
    }
  }, [roomId])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-4xl font-bold mb-8">Chat Room</h1>
      {userCount < 2 ? (
        <div className="text-2xl mb-8">Searching for a partner...</div>
      ) : (
        <P2PChat roomId={roomId} userId={userId} />
      )}
    </main>
  )
}

