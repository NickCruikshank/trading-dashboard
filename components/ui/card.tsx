
import React from "react";
export function Card({ className="", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={"card " + className} />;
}
export function CardContent({ className="", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={"p-4 " + className} />;
}
