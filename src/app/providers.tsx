"use client";

import { AppStore, makeStore } from "@/redux/store";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";

export default function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <ClerkProvider>
      <Provider store={storeRef.current}>{children}</Provider>
    </ClerkProvider>
  );
}
