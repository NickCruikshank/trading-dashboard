
"use client";
import React from "react";
export function Select({ value, onValueChange, children }: any){ return <div>{React.Children.map(children, c=>c)}</div>; }
export function SelectTrigger({ children }: any){ return <div className="w-full">{children}</div>; }
export function SelectValue(){ return <></>; }
export function SelectContent({ children }: any){ return <div className="w-full">{children}</div>; }
export function SelectItem({ value, children, onClick }: any){ return <div className="btn btn-outline w-full mb-1" onClick={()=>onClick?.(value)}>{children}</div>; }
