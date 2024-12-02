'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { usePeerConnection } from '@/lib/usePeerConnection'

interface P2PChatProps {
  roomId: string | null
  userId: string | null
}

export function P2PChat({ roomId, userId }: P2PChatProps) {
  const {
    peerId,
    remotePeerId,
    setRemotePeerId,
    connectionStatus,
    errorMessage,
    messages,
    connectToPeer,
    sendMessage,
    disconnectPeer
  } = usePeerConnection()

  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    if (roomId && userId) {
      // Set up room-based peer connection
      // This is a simplified example. In a real app, you'd use a signaling server.
      const interval = setInterval(async () => {
        const response = await fetch(`/api/room/${roomId}`)
        const data = await response.json()
        const otherUser = data.users.find((user: any) => user.id !== userId)
        if (otherUser && otherUser.peerId && otherUser.peerId !== remotePeerId) {
          setRemotePeerId(otherUser.peerId)
          connectToPeer()
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [roomId, userId, remotePeerId, setRemotePeerId, connectToPeer])

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message.trim())
      setMessage('')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Chat Room: {roomId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Status:</span>
            <span className={`capitalize ${
              connectionStatus === 'connected' ? 'text-green-600' :
              connectionStatus === 'connecting' ? 'text-yellow-600' :
              connectionStatus === 'error' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {connectionStatus}
            </span>
          </div>
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <ScrollArea className="h-[200px] border rounded-md p-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.sender === 'me' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                } max-w-[80%] w-fit`}
              >
                {msg.content}
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Input
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            aria-label="Message input"
          />
          <Button onClick={handleSendMessage} disabled={connectionStatus !== 'connected'}>
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

