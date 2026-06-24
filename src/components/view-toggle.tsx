"use client";

import React from "react";
import { useViewMode } from "./view-mode-provider";
import { User, Bot } from "lucide-react";

export function ViewToggle() {
  const { mode, toggle } = useViewMode();

  return (
    <div className="view-toggle" role="radiogroup" aria-label="View mode">
      <button
        className={`view-toggle__btn ${mode === "human" ? "view-toggle__btn--active" : ""}`}
        onClick={mode !== "human" ? toggle : undefined}
        role="radio"
        aria-checked={mode === "human"}
        aria-label="Human view"
      >
        <User className="view-toggle__icon" aria-hidden="true" />
        <span>Human</span>
      </button>
      <button
        className={`view-toggle__btn ${mode === "machine" ? "view-toggle__btn--active" : ""}`}
        onClick={mode !== "machine" ? toggle : undefined}
        role="radio"
        aria-checked={mode === "machine"}
        aria-label="Machine view"
      >
        <Bot className="view-toggle__icon" aria-hidden="true" />
        <span>Machine</span>
      </button>
    </div>
  );
}
