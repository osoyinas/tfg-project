"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, UserPlus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { CreateListModal } from "@/components/create-list-modal"
import { InviteFriendsModal } from "@/components/invite-friends-modal"
import { ReviewsList } from "./content/reviews-list"
import { getMyProfileWithStats, updateProfile } from "@/services/profile"
import { AvatarPickerDialog } from "@/components/avatar-picker-dialog"
import { useAuthAxios } from "@/hooks/useAuthAxios"
import { ProfileWithStats } from "@/types"
import { useKeycloak } from "./keycloak-provider"

export function ProfileSection() {
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false)
  const [isInviteFriendsModalOpen, setIsInviteFriendsModalOpen] = useState(false)
  const [profile, setProfile] = useState<ProfileWithStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {authenticated, initialized} = useKeycloak()
  const axios = useAuthAxios()

  // Edit mode state
  const [editMode, setEditMode] = useState(false)
  const [editBio, setEditBio] = useState("")
  const [editAvatar, setEditAvatar] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  // Eliminado fileInputRef y avatarFile
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)

  useEffect(() => {
    if (!initialized || !authenticated) return;

    async function fetchProfile() {
      setLoading(true)
      setError(null)
      try {
        const data = await getMyProfileWithStats(axios)
        console.log("Fetched profile data:", data)
        setProfile(data)
      } catch (err) {
        setError("No se pudo cargar el perfil.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [axios, initialized, authenticated])

  // When entering edit mode, set initial values
  useEffect(() => {
    if (editMode && profile) {
      setEditBio(profile.profile.bio || "")
      setEditAvatar(profile.profile.avatarUrl)
      setEditError(null)
      setSuccessMsg(null)
    }
  }, [editMode, profile])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-dark-muted-foreground">Cargando perfil...</span>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-red-500">{error || "Error desconocido."}</span>
      </div>
    )
  }


  const { user, profile: profileData, stats } = profile

  // Eliminar handleAvatarChange

  // Handle avatar selection from dialog
  const handleAvatarDialogSelect = (url: string) => {
    setEditAvatar(url)
  }

  // Save profile changes
  const handleSave = async () => {
    setSaving(true)
    setEditError(null)
    setSuccessMsg(null)
    try {
      const avatarUrl = editAvatar || profileData.avatarUrl
      const updated = await updateProfile({
        bio: editBio,
        avatarUrl: avatarUrl || undefined,
      }, axios)
      setProfile((prev) => prev ? { ...prev, profile: updated.profile } : prev)
      setEditMode(false)
      setSuccessMsg("Perfil actualizado correctamente.")
    } catch (err) {
      setEditError("No se pudo actualizar el perfil.")
    } finally {
      setSaving(false)
    }
  }

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false)
    setEditError(null)
    setSuccessMsg(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-dark-background text-dark-foreground min-h-screen">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <div className="relative">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-dark-primary shadow-lg">
            <AvatarImage src={editMode ? (editAvatar || "/placeholder-user.jpg") : (profileData?.avatarUrl || "/placeholder-user.jpg")} alt={user.name} />
            <AvatarFallback className="bg-dark-accent text-dark-primary text-3xl">{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {editMode && (
            <>
              <div className="absolute bottom-2 right-2 flex">
                <button
                  className="bg-dark-primary text-dark-primary-foreground rounded-full p-2 shadow hover:bg-dark-primary/90 transition"
                  onClick={() => setAvatarDialogOpen(true)}
                  title="Elegir avatar de galería"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
              <AvatarPickerDialog
                open={avatarDialogOpen}
                onOpenChange={setAvatarDialogOpen}
                onSelect={handleAvatarDialogSelect}
              />
            </>
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-dark-primary">{user.name} {user.lastName}</h1>
          <p className="text-dark-muted-foreground text-lg">@{user.username}</p>
          {editMode ? (
            <textarea
              className="mt-2 w-full max-w-prose rounded bg-dark-card border border-dark-border p-2 text-dark-foreground focus:outline-none focus:ring-2 focus:ring-dark-primary min-h-[80px]"
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              maxLength={300}
              placeholder="Escribe tu biografía..."
              disabled={saving}
            />
          ) : (
            <p className="mt-2 text-dark-foreground max-w-prose min-h-[40px]">{profileData?.bio || <span className="text-dark-muted-foreground">Sin biografía.</span>}</p>
          )}
          <div className="flex justify-center md:justify-start gap-6 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-dark-primary">{stats.followers}</span>
              <span className="text-dark-muted-foreground">Seguidores</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-dark-primary">{stats.following}</span>
              <span className="text-dark-muted-foreground">Siguiendo</span>
            </div>
          </div>
          <div className="flex justify-center md:justify-start gap-4 mt-6">
            {editMode ? (
              <>
                <Button
                  className="bg-dark-primary text-dark-primary-foreground hover:bg-dark-primary/90 min-w-[100px]"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  variant="outline"
                  className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary bg-transparent min-w-[100px]"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary bg-transparent min-w-[100px]"
                onClick={() => setEditMode(true)}
              >
                Editar perfil
              </Button>
            )}
          </div>
          {editError && <div className="mt-2 text-red-500">{editError}</div>}
          {successMsg && <div className="mt-2 text-green-500">{successMsg}</div>}
        </div>
      </div>

      <Separator className="my-8 bg-dark-border" />

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 bg-dark-card border-dark-border">
          <TabsTrigger
            value="activity"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Actividad
          </TabsTrigger>
          <TabsTrigger
            value="lists"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Listas
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Reseñas
          </TabsTrigger>
          <TabsTrigger
            value="ratings"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Calificaciones
          </TabsTrigger>
          <TabsTrigger
            value="watched"
            className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
          >
            Visto/Leído
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Actividad Reciente</h2>
          {/* Aquí deberías mapear la actividad real del usuario si está disponible */}
          <div className="text-dark-muted-foreground">Próximamente: actividad reciente.</div>
        </TabsContent>

        <TabsContent value="lists" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Mis Listas</h2>
          <div className="text-dark-muted-foreground">Próximamente: tus listas públicas.</div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Mis Reseñas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReviewsList justMine />
          </div>
        </TabsContent>

        <TabsContent value="ratings" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Mis Calificaciones</h2>
          <div className="text-dark-muted-foreground">Próximamente: tus calificaciones.</div>
        </TabsContent>

        <TabsContent value="watched" className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-dark-primary">Contenido Visto/Leído</h2>
          <div className="text-dark-muted-foreground">Próximamente: tu historial de contenido.</div>
        </TabsContent>
      </Tabs>

      <CreateListModal open={isCreateListModalOpen} onOpenChange={setIsCreateListModalOpen} />
      <InviteFriendsModal open={isInviteFriendsModalOpen} onOpenChange={setIsInviteFriendsModalOpen} />
    </div>
  )
}
