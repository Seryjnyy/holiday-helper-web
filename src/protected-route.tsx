import React, { ReactNode } from "react";
import useAuthStore from "./stores/auth-store";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const session = useAuthStore((state) => state.session);

  if (!session) return <div>No session</div>;
  return <>{children}</>;
}
