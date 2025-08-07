'use client'

import { useState } from 'react'
import { Search, UserPlus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

const mockFriends = [
  {
    id: 1,
    name: "Ana Martín",
    username: "@ana_fantasy",
    avatar: "/placeholder.svg?height=40&width=40&text=AM",
    isInvited: false,
    mutualFriends: 12
  },
  {
    id: 2,
    name: "Luis Rodríguez",
    username: "@luis_books",
    avatar: "/placeholder.svg?height=40&width=40&text=LR",
    isInvited: false,
    mutualFriends: 8
  },
  {
    id: 3,
    name: "Elena Sánchez",
    username: "@elena_reads",
    avatar: "/placeholder.svg?height=40&width=40&text=ES",
    isInvited: true,
    mutualFriends: 15
  },
  {
    id: 4,
    name: "David Torres",
    username: "@david_movies",
    avatar: "/placeholder.svg?height=40&width=40&text=DT",
    isInvited: false,
    mutualFriends: 5
  }
]

interface InviteFriendsModalProps {
  isOpen: boolean
  onClose: () => void
  listTitle: string
}

export function InviteFriendsModal({ isOpen, onClose, listTitle }: InviteFriendsModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [invitedFriends, setInvitedFriends] = useState<number[]>([])

  const filteredFriends = mockFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInvite = (friendId: number) => {
    setInvitedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    )
  }

  const handleSendInvites = () => {
    console.log('Sending invites to:', invitedFriends)
    onClose()
    setInvitedFriends([])
    setSearchQuery('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-purple-600">
            Invitar Amigos
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Invita amigos a colaborar en "{listTitle}"
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar amigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-purple-200 focus:border-purple-400"
            />
          </div>

          {/* Friends List */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredFriends.map((friend) => {
              const isInvited = invitedFriends.includes(friend.id) || friend.isInvited
              const isAlreadyInvited = friend.isInvited
              
              return (
                <div key={friend.id} className="flex items-center gap-3 p-3 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                    <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm truncate">{friend.name}</h3>
                      {isAlreadyInvited && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          Ya invitado
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{friend.username}</p>
                    <p className="text-xs text-gray-400">{friend.mutualFriends} amigos en común</p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={isInvited ? "default" : "outline"}
                    onClick={() => !isAlreadyInvited && handleInvite(friend.id)}
                    disabled={isAlreadyInvited}
                    className={
                      isInvited && !isAlreadyInvited
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-purple-200 text-purple-600 hover:bg-purple-50"
                    }
                  >
                    {isAlreadyInvited ? (
                      <Check className="w-4 h-4" />
                    ) : isInvited ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Invitado
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Invitar
                      </>
                    )}
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSendInvites}
              disabled={invitedFriends.length === 0}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Enviar Invitaciones ({invitedFriends.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
