"use client";

import { useState, useEffect, useRef } from "react";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search agents...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 300);
    return () => clearTimeout(timer);
  }, [local, value, onChange]);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <div className="relative group">
      <div
        className={`absolute -inset-px rounded-xl bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-purple-500/20 opacity-0 blur-sm transition-opacity duration-300 ${focused ? "opacity-100" : ""}`}
      />
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted transition-colors duration-200 group-focus-within:text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          aria-label="Search agents"
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 pl-10 pr-4 text-[13px] text-text-primary placeholder-text-muted outline-none transition-all duration-300 focus:border-purple-500/30 focus:bg-white/[0.03]"
        />
      </div>
    </div>
  );
}
