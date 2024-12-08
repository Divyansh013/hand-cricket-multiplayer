'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import io from 'socket.io-client'

export default function GameRoom() {
  const params = useParams()
  const roomId = params.roomId as string
  const [socket, setSocket] = useState<any>(null)
  const [gameState, setGameState] = useState<any>(null)
  const [playerChoice, setPlayerChoice] = useState<number | null>(null)
  const [isWaiting, setIsWaiting] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
      upgrade: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
      newSocket.emit('joinRoom', roomId)
    })

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err)
      setError('Failed to connect to the game server. Please try again.')
    })

    newSocket.on('gameStart', (initialState) => {
      console.log('Game started:', initialState)
      setGameState(initialState)
      setIsWaiting(false)
    })

    newSocket.on('gameState', (state: any) => {
      console.log('Received game state:', state)
      setGameState(state)
      setPlayerChoice(null)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [roomId])

  const playTurn = (choice: number) => {
    if (socket) {
      setPlayerChoice(choice)
      socket.emit('playTurn', { roomId, choice })
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-red-500">Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (isWaiting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-8">Waiting for Players</h1>
        <p>Room ID: {roomId}</p>
        <p>Please wait for all players to join...</p>
      </div>
    )
  }

  if (!gameState) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Game Room: {roomId}</h1>
      <div className="mb-4">
        <p>Player 1 Score: {gameState.player1Score}</p>
        <p>Player 2 Score: {gameState.player2Score}</p>
      </div>
      <div className="mb-4">
        <p>Current Batter: {gameState.currentBatter === 1 ? 'Player 1' : 'Player 2'}</p>
        <p>Last Result: {gameState.lastResult}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((number) => (
          <Button 
            key={number} 
            onClick={() => playTurn(number)}
            disabled={playerChoice !== null || gameState.currentBatter !== gameState.playerNumber}
          >
            {number}
          </Button>
        ))}
      </div>
      {playerChoice && <p className="mt-4">You chose: {playerChoice}</p>}
    </div>
  )
}

