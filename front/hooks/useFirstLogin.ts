import { useEffect, useState } from "react";

export function useFirstLogin(): [boolean, () => void] {
  const [firstLogin, setFirstLogin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('first_login='));
      if (!cookie) {
        setFirstLogin(true);
        document.cookie = `first_login=false; path=/; max-age=31536000`;
      }
    }
  }, []);

  const dismiss = () => setFirstLogin(false);

  return [firstLogin, dismiss];
}
