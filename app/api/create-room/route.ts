import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// This should be replaced with a database in a real application
let rooms = new Map()

export async function POST(request: Request) {
  const { playerName } = await request.json()
  const roomId = uuidv4()
  rooms.set(roomId, { players: [playerName], gameState: null })
  console.log(`Room created: ${roomId} by ${playerName}`)
  return NextResponse.json({ roomId })
}

