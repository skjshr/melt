"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("melt-theme") as Theme) ?? "dark";
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getStoredTheme, () => "dark" as Theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.toggle("light", getStoredTheme() === "light");
  }, []);

  const toggle = useCallback(() => {
    const next = getStoredTheme() === "dark" ? "light" : "dark";
    localStorage.setItem("melt-theme", next);
    document.documentElement.classList.toggle("light", next === "light");
    window.dispatchEvent(new StorageEvent("storage"));
  }, []);

  return { theme: mounted ? theme : "dark", toggle };
}
