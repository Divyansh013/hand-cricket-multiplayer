import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Hand Cricket</h1>
      <div className="space-y-4">
        <Link href="/create-room">
          <Button className="w-48">Create Room</Button>
        </Link>
        <Link href="/join-room">
          <Button className="w-48" variant="outline">Join Room</Button>
        </Link>
      </div>
    </div>
  )
}

