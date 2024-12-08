'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CreateRoom() {
  const [playerName, setPlayerName] = useState('')
  const [roomId, setRoomId] = useState('')
  const [error, setError] = useState('')
  const [isWaiting, setIsWaiting] = useState(false)
  const router = useRouter()

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName }),
      })
      if (!response.ok) {
        throw new Error('Failed to create room')
      }
      const { roomId } = await response.json()
      setRoomId(roomId)
      setIsWaiting(true)
    } catch (err) {
      setError('Failed to create room. Please try again.')
      console.error(err)
    }
  }

  if (isWaiting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-8">Waiting for Player 2</h1>
        <p className="text-xl mb-4">Your room ID is: {roomId}</p>
        <p>Share this ID with another player to join the game.</p>
        <Button className="mt-4" onClick={() => router.push(`/game/${roomId}`)}>
          Enter Game Room
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Create a Room</h1>
      <form onSubmit={handleCreateRoom} className="space-y-4">
        <Input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          className="w-64"
        />
        <Button type="submit" className="w-full">Create Room</Button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}

