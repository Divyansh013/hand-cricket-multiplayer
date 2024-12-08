import { NextResponse } from 'next/server'

// This should be replaced with a database in a real application
let rooms = new Map()

export async function POST(request: Request) {
  const { roomId, playerName } = await request.json()
  console.log(`Attempt to join room: ${roomId} by ${playerName}`)
  
  if (rooms.has(roomId) && rooms.get(roomId).players.length < 2) {
    const room = rooms.get(roomId)
    room.players.push(playerName)
    console.log(`${playerName} joined room ${roomId}`)
    return NextResponse.json({ success: true })
  } else {
    console.log(`Failed to join room ${roomId}: ${rooms.has(roomId) ? 'Room is full' : 'Room not found'}`)
    return NextResponse.json({ success: false, error: 'Room not found or full' }, { status: 400 })
  }
}

