
import React from "react";
export function Table({ children }: { children: React.ReactNode }) { return <table className="table">{children}</table>; }
export function TableHeader({ children }: { children: React.ReactNode }) { return <thead className="bg-slate-50">{children}</thead>; }
export function TableBody({ children }: { children: React.ReactNode }) { return <tbody>{children}</tbody>; }
export function TableRow({ children, className="" }: { children: React.ReactNode, className?: string }) { return <tr className={"row " + className}>{children}</tr>; }
export function TableHead({ children, className="", onClick }: { children: React.ReactNode, className?: string, onClick?: ()=>void }) { return <th onClick={onClick} className={"th " + className}>{children}</th>; }
export function TableCell({ children, className="" }: { children: React.ReactNode, className?: string }) { return <td className={"td " + className}>{children}</td>; }
