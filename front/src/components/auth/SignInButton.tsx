'use client';

import { signIn } from '@/services/signIn';

export default function SignIn() {
  return (
    <form action={signIn}>
      <button type="submit">Sign in</button>
    </form>
  );
}