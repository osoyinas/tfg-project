"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { ReviewsList } from "./content/reviews-list";
import {
  getMyProfileWithStats,
  getUserProfile,
  updateProfile,
} from "@/services/profile";
import { AvatarPickerDialog } from "@/components/avatar-picker-dialog";
import { useAuthAxios } from "@/hooks/useAuthAxios";
import { ProfileWithStats } from "@/types";
import { useKeycloak } from "./keycloak-provider";

interface ProfileSectionProps {
  userId?: string;
}

export function ProfileSection({ userId }: ProfileSectionProps) {
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isInviteFriendsModalOpen, setIsInviteFriendsModalOpen] =
    useState(false);
  const [profile, setProfile] = useState<ProfileWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authenticated, initialized } = useKeycloak();
  const axios = useAuthAxios();

  // Edit mode state
  // Solo permitir edición si es el perfil propio
  const isOwnProfile = !userId;
  const [editMode, setEditMode] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  // Eliminado fileInputRef y avatarFile
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  useEffect(() => {
    if (!initialized || !authenticated) return;

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (userId) {
          // Perfil ajeno
          data = await getUserProfile(userId, axios);
        } else {
          // Perfil propio
          data = await getMyProfileWithStats(axios);
        }
        setProfile(data as ProfileWithStats);
      } catch (err) {
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [axios, initialized, authenticated, userId]);

  // When entering edit mode, set initial values
  useEffect(() => {
    if (editMode && profile) {
      setEditBio(profile.profile.bio || "");
      setEditAvatar(profile.profile.avatarUrl);
      setEditError(null);
      setSuccessMsg(null);
    }
  }, [editMode, profile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-dark-muted-foreground">Cargando perfil...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-red-500">{error || "Error desconocido."}</span>
      </div>
    );
  }

  const { user, profile: profileData, stats } = profile;

  // Eliminar handleAvatarChange

  // Handle avatar selection from dialog
  const handleAvatarDialogSelect = (url: string) => {
    setEditAvatar(url);
  };

  // Save profile changes
  const handleSave = async () => {
    if (!isOwnProfile) return;
    setSaving(true);
    setEditError(null);
    setSuccessMsg(null);
    try {
      const avatarUrl = editAvatar || profileData.avatarUrl;
      const updated = await updateProfile(
        {
          bio: editBio,
          avatarUrl: avatarUrl || undefined,
        },
        axios
      );
      setProfile((prev) =>
        prev ? { ...prev, profile: updated.profile } : prev
      );
      setEditMode(false);
      setSuccessMsg("Perfil actualizado correctamente.");
    } catch (err) {
      setEditError("No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
    setEditError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="mx-auto px-4 py-8 bg-dark-background text-dark-foreground min-h-screen mb-16 justify-center flex ">
      <div className="max-w-4xl w-full">
        <div className="relative flex flex-col items-center gap-4 mb-8 w-full">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 h-40 md:h-56 w-full bg-gradient-to-b from-dark-primary/30 to-transparent rounded-b-3xl -z-10" />
          <div className="relative mt-4">
            <Avatar className="h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 border-4 border-dark-primary shadow-xl mx-auto transition-all duration-300">
              <AvatarImage
                src={
                  editMode
                    ? editAvatar || "/placeholder-user.jpg"
                    : profileData?.avatarUrl || "/placeholder-user.jpg"
                }
                alt={user.name}
              />
              <AvatarFallback className="bg-dark-accent text-dark-primary text-4xl">
                {user.name?.charAt(0)}
              </AvatarFallback>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-primary text-center drop-shadow-lg mt-2">
            {user.name} {user.lastName}
          </h1>
          <p className="text-dark-muted-foreground text-lg sm:text-xl text-center">
            @{user.username}
          </p>
          {isOwnProfile && editMode ? (
            <textarea
              className="mt-4 w-full max-w-prose rounded bg-dark-card border border-dark-border p-2 text-dark-foreground focus:outline-none focus:ring-2 focus:ring-dark-primary min-h-[80px]"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              maxLength={300}
              placeholder="Escribe tu biografía..."
              disabled={saving}
            />
          ) : (
            <p className="mt-4 text-dark-foreground max-w-prose min-h-[40px] text-center text-base sm:text-lg">
              {profileData?.bio || (
                <span className="text-dark-muted-foreground">
                  Sin biografía.
                </span>
              )}
            </p>
          )}

          {/* Estadísticas de reseñas y likes */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 w-full max-w-xs sm:max-w-md md:max-w-lg">
            <div className="flex-1 min-w-[120px] bg-dark-card rounded-xl shadow p-4 flex flex-col items-center transition-transform hover:scale-105">
              <span className="text-2xl font-bold text-dark-primary animate-pulse-slow">
                {stats?.reviews}
              </span>
              <span className="text-dark-muted-foreground text-sm">
                Reseñas
              </span>
            </div>
            <div className="flex-1 min-w-[120px] bg-dark-card rounded-xl shadow p-4 flex flex-col items-center transition-transform hover:scale-105">
              <span className="text-2xl font-bold text-dark-primary animate-pulse-slow">
                {stats?.likesReceived}
              </span>
              <span className="text-dark-muted-foreground text-sm">
                Likes recibidos
              </span>
            </div>
          </div>
          {isOwnProfile && (
            <div className="flex justify-center gap-4 mt-6">
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
                <>
                  <Button
                    variant="outline"
                    className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary bg-transparent min-w-[100px]"
                    onClick={() => setEditMode(true)}
                  >
                    Editar perfil
                  </Button>
                  <a href="/account">
                    <Button
                      variant="outline"
                      className="border-dark-border text-dark-foreground hover:bg-dark-accent hover:text-dark-primary bg-transparent min-w-[100px]"
                      type="button"
                    >
                      Cuenta
                    </Button>
                  </a>
                </>
              )}
            </div>
          )}
          {editError && (
            <div className="mt-2 text-red-500 text-center">{editError}</div>
          )}
          {successMsg && (
            <div className="mt-2 text-green-500 text-center">{successMsg}</div>
          )}
        </div>

        <Separator className="my-8 bg-dark-border" />

        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-dark-card border-dark-border mb-6">
            <TabsTrigger
              value="reviews"
              className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
            >
              Reseñas
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="text-dark-foreground data-[state=active]:bg-dark-primary data-[state=active]:text-dark-primary-foreground"
            >
              Likes y Comentarios
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reviews" className="mt-0">
            <h2 className="text-2xl font-bold mb-4 text-dark-primary">
              Mis Reseñas
            </h2>
            <div className="flex flex-col gap-4">
              <ReviewsList justMine withItems />
            </div>
          </TabsContent>
          <TabsContent value="activity" className="mt-0">
            <h2 className="text-2xl font-bold mb-4 text-dark-primary">
              Likes y Comentarios
            </h2>
            <div className="text-dark-muted-foreground">
              Próximamente: actividad de likes y comentarios tipo Twitter.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
