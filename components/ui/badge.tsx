
import React from "react";
type Props = React.HTMLAttributes<HTMLSpanElement> & { variant?: "secondary" | "outline" | "destructive" };
export function Badge({ className="", variant="secondary", ...props }: Props) {
  const v = variant==="secondary" ? "badge border-slate-200 bg-slate-50 text-slate-700" :
            variant==="destructive" ? "badge border-red-100 bg-red-50 text-red-700" :
            "badge border-slate-300 text-slate-700";
  return <span {...props} className={v + " " + className} />;
}
