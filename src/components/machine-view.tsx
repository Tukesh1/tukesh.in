"use client";

import React, { useEffect, useRef, useState } from "react";
import { buildProfileText } from "@/lib/build-profile-text";
import { Copy, Check } from "lucide-react";

import { Panel, PanelContent } from "@/components/panel";

const MACHINE_TEXT = buildProfileText();

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MachineView() {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // Typewriter-style entrance animation
  useEffect(() => {
    const el = preRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(MACHINE_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Panel className="machine-view relative mt-6 border-t-0 mb-0 min-h-screen">
      {/* Floating copy button fixed at the top right of the screen */}
      <button
        onClick={handleCopy}
        className="fixed top-4 right-4 md:top-8 md:right-8 p-3 rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800/50 text-gray-500 dark:text-gray-400 transition-colors z-50"
        aria-label="Copy prompt"
        title="Copy prompt"
      >
        {copied ? <Check size={20} /> : <Copy size={20} />}
      </button>

      <PanelContent>
        <pre ref={preRef} className="machine-view__content">
          {MACHINE_TEXT}
        </pre>
      </PanelContent>
    </Panel>
  );
}
