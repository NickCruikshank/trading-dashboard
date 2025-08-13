
"use client";
import React, { useState, createContext, useContext } from "react";
const Ctx = createContext<any>(null);
export function Drawer({ children }: any){
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{open,setOpen}}>{children}</Ctx.Provider>;
}
export function DrawerTrigger({ asChild, children }: any){
  const { setOpen } = useContext(Ctx);
  const child = React.Children.only(children);
  return React.cloneElement(child, { onClick: ()=>setOpen(true) });
}
export function DrawerContent({ children, className="" }: any){
  const { open, setOpen } = useContext(Ctx);
  if(!open) return null;
  return <div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}>
    <div className="absolute inset-0 bg-black/30" />
    <div className={"absolute bottom-0 left-0 right-0 card bg-white p-2 " + className} onClick={(e)=>e.stopPropagation()}>{children}</div>
  </div>;
}
export function DrawerHeader({ children }: any){ return <div className="px-4 py-2 border-b">{children}</div>; }
export function DrawerTitle({ children }: any){ return <div className="text-lg font-semibold">{children}</div>; }
