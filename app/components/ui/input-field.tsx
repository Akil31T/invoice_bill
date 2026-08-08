"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  success?: boolean;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      label,
      icon,
      success = false,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={cn(
          "group flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_10px_30px_-12px_rgba(2,6,23,0.15)] ring-1 ring-slate-100 transition focus-within:ring-2 focus-within:ring-[#6c5ce7]",
          className
        )}
      >
        <div className="shrink-0 text-slate-400">{icon}</div>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </div>

          <input
            ref={ref}
            type={type}
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            {...props}
          />
        </div>

        {success && (
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                d="M5 12l5 5L20 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </label>
    );
  }
);

InputField.displayName = "InputField";

export { InputField };