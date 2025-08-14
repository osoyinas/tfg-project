"use client";

import React, { useEffect, useState } from "react";

interface FullPageLoaderProps {
  children?: React.ReactNode;
}

export function FullPageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Para simular fade out más lento al desmontar
  useEffect(() => {
    if (!visible) {
      setFadeOut(true);
      const timeout = setTimeout(() => {
        setFadeOut(false);
      }, 800); // Duración del fade out
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  // Si fadeOut terminó, no renderizar nada
  if (!visible && !fadeOut) return null;

  return (
    <div
      className={
        "fixed inset-0 z-50 flex items-center justify-center pointer-events-auto" +
        (fadeOut ? " pointer-events-none" : "")
      }
      style={{
        transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
        opacity: fadeOut ? 0 : 1,
      }}
    >
      {/* Overlay con blur y opacidad progresiva */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-800 opacity-100" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen">
        <div className="flex flex-col items-center justify-center flex-grow min-h-[40vh] w-full">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-20 h-20 mb-6">
              {/* Outer spinner */}
              <div className="absolute inset-0 rounded-full border-8 border-t-transparent border-b-transparent border-primary animate-spin" />
              {/* Middle spinner */}
              <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-b-transparent border-secondary animate-spin-slow" />
              {/* Inner circle */}
              <div className="absolute inset-8 rounded-full bg-primary/80" />
            </div>
            <span className="text-xl font-semibold text-primary tracking-wide animate-pulse mb-4 text-center">
              Cargando tu experiencia...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
