"use client";

import React from "react";
import { useViewMode } from "./view-mode-provider";
import { MachineView } from "./machine-view";
import { Header } from "./header";
import { Footer } from "./footer";

export function AppView({ children }: { children: React.ReactNode }) {
  const { mode } = useViewMode();

  if (mode === "machine") {
    return (
      <main className="mx-4 px-2 md:px-0 lg:mx-auto flex flex-col min-h-screen">
        <MachineView />
      </main>
    );
  }

  return (
    <main className="mx-4 px-2 md:px-0 lg:mx-auto flex flex-col justify-between min-h-screen">
      <Header />
      <div className="animate-fade-up flex-1 flex flex-col">{children}</div>
      <Footer />
    </main>
  );
}
