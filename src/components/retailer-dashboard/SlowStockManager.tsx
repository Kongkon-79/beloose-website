"use client";

import { Pencil, Trash2, TriangleAlert, Upload, X } from "lucide-react";
import { useState } from "react";

const initialRows = [
  ["INV-001","Cohiba Siglo I","$38.00","Cohiba","Premium","110"],
  ["INV-002","Arturo Fuente Hemingway","$26.50","Arturo Fuente","Mid","98"],
  ["INV-003","Padron 1964 Anniversary","$18.00","Padron","Premium","100"],
  ["INV-004","Montecristo #2","$85.00","Rocky Patel","Premium","118"],
];
type Modal = "edit" | "delete" | null;

export default function SlowStockManager() {
  const [rows,setRows] = useState(initialRows);
  const [selected,setSelected] = useState(0);
  const [modal,setModal] = useState<Modal>(null);
  const open=(type:Modal,index:number)=>{setSelected(index);setModal(type)};
  const close=()=>setModal(null);
  const remove=()=>{setRows(items=>items.filter((_,i)=>i!==selected));close()};
  const update=(row:string[])=>{setRows(items=>items.map((item,i)=>i===selected?row:item));close()};

  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-5"><div className="overflow-x-auto rounded-xl border border-[#e0c78c]"><table className="w-full min-w-[900px] border-collapse bg-[#34200e] text-sm"><thead className="bg-[#211305]"><tr>{["Image","SKU","Product Name","Price","Brand","Category","Days","Action"].map(x=><th className="h-12 px-5 text-left text-xs font-medium" key={x}>{x}</th>)}</tr></thead><tbody>{rows.map((row,index)=><tr className="border-t border-[#765326]" key={row[0]}><td className="h-[68px] px-5"><span className="grid h-9 w-11 place-items-center rounded bg-gradient-to-br from-[#805327] to-[#241306] text-[#d9aa43]">▥</span></td>{row.map((value,i)=><td className="h-[68px] whitespace-nowrap px-5" key={i}>{i===4?<span className="inline-block min-w-20 rounded bg-[#65461e] px-2 py-1 text-center">{value}</span>:value}</td>)}<td className="h-[68px] px-5"><span className="flex gap-4"><button aria-label="Edit" onClick={()=>open("edit",index)} className="transition hover:scale-110 hover:text-[#d3a440]"><Pencil size={18}/></button><button aria-label="Delete" onClick={()=>open("delete",index)} className="transition hover:scale-110 hover:text-[#ef6262]"><Trash2 size={18}/></button></span></td></tr>)}</tbody></table></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm"><span>Showing 1 to {rows.length} of 12 results</span><div className="flex gap-2">{["‹","1","2","3","…","8","›"].map(x=><button className={`h-10 w-10 rounded border border-[#a88b5d] hover:bg-[#d1a13d] hover:text-[#291806] ${x==="1"?"bg-[#d1a13d] text-[#291806]":""}`} key={x}>{x}</button>)}</div></div>
    {modal&&<div className="fixed inset-0 z-50 grid place-items-center bg-[#150b04b8] p-5 backdrop-blur-md" onMouseDown={close}><div className="relative w-full max-w-[430px] rounded-lg bg-[#573621] p-5" onMouseDown={e=>e.stopPropagation()}>{modal==="edit"&&<button onClick={close} className="absolute right-0 top-0 grid h-9 w-9 place-items-center rounded-bl-xl rounded-tr-lg bg-[#d2a23f] text-[#35200c]"><X size={19}/></button>}{modal==="edit"?<EditForm row={rows[selected]} close={close} update={update}/>:<DeleteDialog close={close} remove={remove}/>}</div></div>}
  </div>;
}

function EditForm({row,close,update}:{row:string[];close:()=>void;update:(row:string[])=>void}){const [values,setValues]=useState([...row]);const labels=["SKU","Product Name","Price","Brand","Category","Days"];return <><h2 className="mb-4 font-playfair text-2xl font-semibold text-[#d5a744]">Edit Slow Stock</h2><form onSubmit={e=>{e.preventDefault();update(values)}} className="space-y-2.5">{labels.map((label,i)=><label className="flex flex-col gap-1 text-[10px]" key={label}><span>{label}</span><input value={values[i]} onChange={e=>setValues(v=>v.map((x,j)=>j===i?e.target.value:x))} className="h-9 rounded bg-[#68462f] px-3 text-[11px] outline-none"/></label>)}<label className="flex flex-col gap-1 text-[10px]"><span>Image</span><span className="flex h-28 flex-col items-center justify-center gap-2 rounded border border-dashed border-[#dac598]"><Upload size={18}/><small>Upload Humidor Image (JPG, PNG)</small></span><input type="file" className="hidden"/></label><Actions close={close} action="Done"/></form></>}
function DeleteDialog({close,remove}:{close:()=>void;remove:()=>void}){return <><h2 className="mb-4 font-playfair text-2xl font-semibold text-[#d5a744]">Delete a Slow Stock</h2><span className="grid h-8 w-8 place-items-center rounded-full bg-[#6c4a24]"><TriangleAlert size={15} className="text-[#e0ae45]"/></span><h3 className="mt-3 text-xs">Are You Sure?</h3><p className="mt-1 text-[10px] text-[#c6ad7e]">Are you sure you want to delete this Slow Stock?</p><Actions close={close} action="Delete" onAction={remove}/></>}
function Actions({close,action,onAction}:{close:()=>void;action:string;onAction?:()=>void}){return <div className="mt-4 grid grid-cols-2 gap-1.5"><button type="button" onClick={close} className="h-9 border border-[#c8983b] text-[10px]">Cancel</button><button type={onAction?"button":"submit"} onClick={onAction} className="h-9 bg-[#d1a23f] text-[10px] text-[#291806]">{action}</button></div>}
