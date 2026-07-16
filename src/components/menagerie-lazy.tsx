"use client";

import dynamic from "next/dynamic";

export const MenagerieLazy = dynamic(
  () => import("@/components/menagerie").then((m) => m.Menagerie),
  { ssr: false }
);
