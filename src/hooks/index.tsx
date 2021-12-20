import React, { ReactNode } from "react";

interface AppProviderProps {
  children: ReactNode;
}

import { AuthProvider } from "./auth";

function AppProvider({ children }: AppProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}

export { AppProvider };
