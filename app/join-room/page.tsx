'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function JoinRoom() {
  const [roomId, setRoomId] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('/api/join-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, playerName }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        router.push(`/game/${roomId}`)
      } else {
        throw new Error(data.error || 'Failed to join room')
      }
    } catch (err) {
      setError('Failed to join room. Please check the room ID and try again.')
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Join a Room</h1>
      <form onSubmit={handleJoinRoom} className="space-y-4">
        <Input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
          className="w-64"
        />
        <Input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          className="w-64"
        />
        <Button type="submit" className="w-full">Join Room</Button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}

