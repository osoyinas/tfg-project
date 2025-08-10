"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, Mail, Copy } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface InviteFriendsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteFriendsModal({ open, onOpenChange }: InviteFriendsModalProps) {
  const [email, setEmail] = useState("")
  const [copied, setCopied] = useState(false)

  const inviteLink = "https://app.example.com/invite/yourfriend" // Replace with actual invite link logic

  const handleSendInvite = () => {
    console.log("Sending invite to:", email)
    // Simulate sending email
    alert(`Invitación enviada a ${email}!`)
    setEmail("")
    onOpenChange(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-card border-dark-border text-dark-foreground">
        <DialogHeader>
          <DialogTitle className="text-dark-primary">Invitar Amigos</DialogTitle>
          <DialogDescription className="text-dark-muted-foreground">
            Invita a tus amigos a unirse a MovieBookSeries para compartir reseñas y listas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="email-invite" className="text-dark-foreground">
              Invitar por Email
            </Label>
            <div className="flex gap-2">
              <Input
                id="email-invite"
                type="email"
                placeholder="amigo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-dark-input border-dark-border text-dark-foreground focus:border-dark-primary focus:ring-dark-primary"
              />
              <Button
                onClick={handleSendInvite}
                className="bg-dark-primary text-dark-primary-foreground hover:bg-dark-primary/90"
              >
                <Mail className="mr-2 h-4 w-4" />
                Enviar
              </Button>
            </div>
          </div>

          <Separator className="bg-dark-border" />

          <div className="space-y-2">
            <Label htmlFor="invite-link" className="text-dark-foreground">
              Compartir Enlace
            </Label>
            <div className="flex gap-2">
              <Input
                id="invite-link"
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 bg-dark-input border-dark-border text-dark-foreground"
              />
              <Button
                onClick={handleCopyLink}
                className="bg-dark-secondary text-dark-secondary-foreground hover:bg-dark-secondary/90"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
          </div>

          <Separator className="bg-dark-border" />

          <div className="space-y-2">
            <h3 className="text-dark-foreground">Invitar de tus Contactos</h3>
            <div className="flex items-center gap-2">
              <Checkbox
                id="sync-contacts"
                className="border-dark-border data-[state=checked]:bg-dark-primary data-[state=checked]:text-dark-primary-foreground"
              />
              <Label htmlFor="sync-contacts" className="text-dark-muted-foreground">
                Sincronizar contactos para encontrar amigos
              </Label>
            </div>
            <Button
              variant="outline"
              className="w-full border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary bg-transparent"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Buscar Amigos
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
