import { useState, useEffect, useRef, useCallback } from 'react'
import Peer from 'peerjs'

interface Message {
  sender: 'me' | 'peer'
  content: string
}

export function usePeerConnection(roomId: string | null, userId: string | null) {
  const [peerId, setPeerId] = useState<string>('')
  const [remotePeerId, setRemotePeerId] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const peerRef = useRef<Peer>()
  const connectionRef = useRef<Peer.DataConnection>()

  useEffect(() => {
    const peer = new Peer()

    peer.on('open', async (id) => {
      setPeerId(id)
      if (roomId && userId) {
        // Update user's peerId in the database
        await fetch(`/api/room/${roomId}/user/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ peerId: id })
        })
      }
    })

    peer.on('connection', (conn) => {
      connectionRef.current = conn
      setConnectionStatus('connected')
      setupConnectionListeners(conn)
    })

    peer.on('error', (err) => {
      console.error('Peer error:', err)
      setConnectionStatus('error')
      setErrorMessage(`Peer error: ${err.type}`)
    })

    peerRef.current = peer

    return () => {
      peer.destroy()
    }
  }, [roomId, userId])

  const setupConnectionListeners = useCallback((conn: Peer.DataConnection) => {
    conn.on('data', (data) => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'peer', content: data as string }])
    })

    conn.on('close', () => {
      setConnectionStatus('disconnected')
      setErrorMessage(null)
    })

    conn.on('error', (err) => {
      console.error('Connection error:', err)
      setConnectionStatus('error')
      setErrorMessage(`Connection error: ${err}`)
    })
  }, [])

  const connectToPeer = useCallback(() => {
    if (peerRef.current && remotePeerId) {
      setConnectionStatus('connecting')
      setErrorMessage(null)
      const conn = peerRef.current.connect(remotePeerId)
      
      const timeout = setTimeout(() => {
        if (connectionStatus === 'connecting') {
          conn.close()
          setConnectionStatus('error')
          setErrorMessage('Connection attempt timed out. Please try again.')
        }
      }, 10000) // 10 seconds timeout

      conn.on('open', () => {
        clearTimeout(timeout)
        setConnectionStatus('connected')
        connectionRef.current = conn
        setupConnectionListeners(conn)
      })
    }
  }, [remotePeerId, connectionStatus, setupConnectionListeners])

  const sendMessage = useCallback((message: string) => {
    if (connectionRef.current && message) {
      connectionRef.current.send(message)
      setMessages((prevMessages) => [...prevMessages, { sender: 'me', content: message }])
    }
  }, [])

  const disconnectPeer = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close()
    }
    setConnectionStatus('disconnected')
    setErrorMessage(null)
  }, [])

  return {
    peerId,
    remotePeerId,
    setRemotePeerId,
    connectionStatus,
    errorMessage,
    messages,
    connectToPeer,
    sendMessage,
    disconnectPeer
  }
}

