
"use client";
import React from "react";
export function Switch({ checked, onCheckedChange }: { checked?: boolean, onCheckedChange?: (v:boolean)=>void }){
  return <button onClick={()=>onCheckedChange?.(!checked)} className={"w-10 h-6 rounded-full border " + (checked ? "bg-slate-900 border-slate-900" : "bg-white border-slate-300")}>
    <span className={"block h-5 w-5 bg-white rounded-full transition " + (checked ? "translate-x-4" : "translate-x-1")} />
  </button>;
}
