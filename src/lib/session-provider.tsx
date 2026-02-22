"use client";

import { createContext, useContext } from "react";
import type { Role } from "@/generated/prisma/client";

type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
  isSuspended: boolean;
} | null;

type SessionContextType = {
  user: SessionUser;
};

const SessionContext = createContext<SessionContextType>({ user: null });

export function SessionProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={{ user }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
