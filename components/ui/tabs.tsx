
"use client";
import React, { createContext, useContext, useState } from "react";
type Ctx = { value: string, setValue: (v:string)=>void };
const TabsCtx = createContext<Ctx | null>(null);
export function Tabs({ value, onValueChange, children, className="" }: { value?: string, onValueChange?: (v:string)=>void, children: React.ReactNode, className?: string }){
  const [val, setVal] = useState(value ?? "");
  return <div className={className}><TabsCtx.Provider value={{ value: value ?? val, setValue: onValueChange ?? setVal }}>{children}</TabsCtx.Provider></div>;
}
export function TabsList({ children }: { children: React.ReactNode }){ return <div className="inline-flex gap-2 rounded-2xl border p-1 bg-slate-50">{children}</div>; }
export function TabsTrigger({ value, children }: { value: string, children: React.ReactNode }){
  const ctx = useContext(TabsCtx)!;
  const active = ctx.value === value;
  return <button onClick={()=>ctx.setValue(value)} className={"btn " + (active ? "btn-primary" : "btn-outline")}>{children}</button>;
}
export function TabsContent({ value, children, className="" }: { value: string, children: React.ReactNode, className?: string }){
  const ctx = useContext(TabsCtx)!;
  return ctx.value === value ? <div className={className}>{children}</div> : null;
}
