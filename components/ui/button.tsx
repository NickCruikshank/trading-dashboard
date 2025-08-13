
import React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "destructive"; size?: "sm" | "md" | "icon" };
export function Button({ className="", variant="primary", size="md", ...props }: Props) {
  const v = variant==="primary" ? "btn btn-primary" :
            variant==="outline" ? "btn btn-outline" :
            variant==="destructive" ? "btn bg-red-600 text-white border-red-600" : "btn";
  const s = size==="sm" ? "px-2 py-1 text-xs rounded-xl" : size==="icon" ? "h-9 w-9 p-0" : "";
  return <button className={v + " " + s + " " + className} {...props} />;
}
export default Button;
