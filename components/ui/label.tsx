
import React from "react";
export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs text-slate-500 block mb-1">{children}</label>;
}
