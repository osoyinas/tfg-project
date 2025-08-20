'use client'
import { useFirstLogin } from "@/hooks/useFirstLogin";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const AVATARS = [
  "/avatar-movie-1.png",
  "/avatar-movie-2.png",
  "/avatar-movie-3.png",
  "/avatar-movie-4.png",
  "/avatar-movie-5.png",
];

export function FirstLoginProfileDialog({ onAvatarSelect }: { onAvatarSelect: (avatar: string) => void }) {
  const [selected, setSelected] = useState<string>("");
  const [firstLogin, dismiss] = useFirstLogin();

  const handleSelect = (avatar: string) => {
    setSelected(avatar);
  };

  const handleSave = () => {
    if (selected) {
      onAvatarSelect(selected);
      dismiss();
    }
  };

  return (
    <Dialog open={firstLogin} onOpenChange={dismiss}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>¡Personaliza tu perfil!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-4 justify-center py-4">
          {AVATARS.map((avatar) => (
            <button
              key={avatar}
              className={`rounded-full border-4 ${selected === avatar ? 'border-yellow-400' : 'border-transparent'} focus:outline-none`}
              onClick={() => handleSelect(avatar)}
            >
              <img src={avatar} alt="avatar" className="w-20 h-20 object-cover rounded-full" />
            </button>
          ))}
        </div>
        <button
          className="w-full mt-2 py-2 bg-movie-red text-white rounded disabled:opacity-50"
          disabled={!selected}
          onClick={handleSave}
        >
          Guardar avatar
        </button>
      </DialogContent>
    </Dialog>
  );
}
