
"use client";
import React, { useState, createContext, useContext } from "react";
const Ctx = createContext<any>(null);
export function Dialog({ children }: any){
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{open,setOpen}}>{children}</Ctx.Provider>;
}
export function DialogTrigger({ asChild, children }: any){
  const { setOpen } = useContext(Ctx);
  const child = React.Children.only(children);
  return React.cloneElement(child, { onClick: ()=>setOpen(true) });
}
export function DialogContent({ children, className="" }: any){
  const { open, setOpen } = useContext(Ctx);
  if(!open) return null;
  return <div className={"fixed inset-0 bg-black/30 flex items-center justify-center z-50"} onClick={()=>setOpen(false)}>
    <div className={"card w-[90vw] max-w-[680px] bg-white " + className} onClick={(e)=>e.stopPropagation()}>{children}</div>
  </div>;
}
export function DialogHeader({ children }: any){ return <div className="p-4 border-b">{children}</div>; }
export function DialogTitle({ children }: any){ return <div className="text-lg font-semibold">{children}</div>; }
