import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../hooks/auth";

import { TabAppRoutes } from "./app.tab.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {user ? <TabAppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
