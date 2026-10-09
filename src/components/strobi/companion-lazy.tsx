"use client"

import dynamic from "next/dynamic"

export const StrobiCompanionLazy = dynamic(
  () => import("./companion").then((m) => m.StrobiCompanion),
  { ssr: false }
)
