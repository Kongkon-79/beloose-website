"use client";

import { Eye, MapPin, Pencil, Plus, Thermometer, Trash2, TriangleAlert, X } from "lucide-react";
import { useState } from "react";

type Humidor = { name: string; description: string; labels: string[] };
type Modal = "add" | "view" | "delete" | null;

const initialHumidors: Humidor[] = [
  { name: "Main Walk-In Humidor", description: "Climate-controlled premium cigar collection", labels: ["Wall-1", "Row-2", "Shelf A"] },
  { name: "Boutique Selection Cabinet", description: "Curated boutique and limited releases", labels: ["Wall-1", "Row-2", "Shelf A"] },
  { name: "Reserve Collection", description: "Rare, aged, and exclusive cigars", labels: ["Wall-1", "Row-2", "Shelf A"] },
];

export default function HumidorManager() {
  const [humidors, setHumidors] = useState(initialHumidors);
  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState(0);
  const close = () => setModal(null);
  const open = (type: Modal, index = 0) => { setSelected(index); setModal(type); };
  const remove = () => { setHumidors(items => items.filter((_, index) => index !== selected)); close(); };

  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-4">
    <div className="flex justify-end"><button onClick={()=>open("add")} className="flex h-10 min-w-40 items-center justify-center gap-2 rounded-sm bg-[#d3a440] px-5 text-xs font-medium text-[#291806] transition hover:-translate-y-0.5 hover:bg-[#e0b653]"><Plus size={16}/> Add Humidor</button></div>

    <section className="mt-4 space-y-3">
      {humidors.map((humidor,index)=><article className="rounded-md bg-[#2d1a08] p-5 sm:p-6" key={humidor.name}>
        <div className="flex items-start justify-between gap-4"><div><h2 className="font-playfair text-xl font-semibold text-[#f2dca5]">{humidor.name}</h2><p className="mt-1 text-[11px] text-[#a88a59]">{humidor.description}</p></div><div className="flex shrink-0 gap-2.5 text-[#efd89b]"><button aria-label="Edit" className="transition hover:scale-110 hover:text-[#d3a440]"><Pencil size={16}/></button><button aria-label="View" onClick={()=>open("view",index)} className="transition hover:scale-110 hover:text-[#d3a440]"><Eye size={16}/></button><button aria-label="Delete" onClick={()=>open("delete",index)} className="transition hover:scale-110 hover:text-[#d3a440]"><Trash2 size={16}/></button></div></div>
        <div className="mt-3 flex flex-wrap gap-1.5">{humidor.labels.map((label,i)=><span className="flex items-center gap-1 rounded border border-[#765627] bg-[#513719] px-2 py-1 text-[9px] text-[#b99b68]" key={label}>{i===2?<Thermometer size={10}/>:<MapPin size={10}/>} {label}</span>)}</div>
      </article>)}
    </section>

    {modal&&<div className="fixed inset-0 z-50 grid place-items-center bg-[#150b04b8] p-5 backdrop-blur-md" onMouseDown={close}><div className="relative max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-lg bg-[#573621] p-5 shadow-2xl" onMouseDown={event=>event.stopPropagation()}><button onClick={close} className="absolute right-0 top-0 grid h-9 w-9 place-items-center rounded-bl-xl rounded-tr-lg bg-[#d2a23f] text-[#35200c]"><X size={19}/></button>{modal==="add"&&<AddHumidor close={close} add={humidor=>{setHumidors(items=>[...items,humidor]);close()}}/>}{modal==="view"&&<HumidorDetails humidor={humidors[selected]}/>} {modal==="delete"&&<DeleteHumidor close={close} remove={remove}/>}</div></div>}
  </div>;
}

const inputClass = "h-10 rounded bg-[#68462f] px-3 text-xs text-[#eadcb9] outline-none placeholder:text-[#bca37b] focus:ring-1 focus:ring-[#d1a23f]";

function AddHumidor({close,add}:{close:()=>void;add:(humidor:Humidor)=>void}) {
  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [labels,setLabels] = useState("");
  return <><h2 className="mb-5 font-playfair text-2xl font-semibold text-[#d5a744]">Add New Humidor</h2><form onSubmit={event=>{event.preventDefault();add({name:name||"New Humidor",description:description||"New cigar collection",labels:labels.split(",").map(x=>x.trim()).filter(Boolean)})}} className="space-y-3"><label className="flex flex-col gap-1.5 text-[11px]"><span>Humidor Name</span><input required value={name} onChange={e=>setName(e.target.value)} className={inputClass} placeholder="e.g., Main Cabinet"/></label><label className="flex flex-col gap-1.5 text-[11px]"><span>Description</span><input value={description} onChange={e=>setDescription(e.target.value)} className={inputClass} placeholder="e.g., Walk-in room at the back"/></label><label className="flex flex-col gap-1.5 text-[11px]"><span>Shelf Labels</span><input value={labels} onChange={e=>setLabels(e.target.value)} className={inputClass} placeholder="e.g., A-1, A-2, A-3, B-1, B-2"/></label><ModalActions close={close} action="Add"/></form></>;
}

function HumidorDetails({humidor}:{humidor:Humidor}) {return <><h2 className="mb-5 font-playfair text-2xl font-semibold text-[#d5a744]">Humidor Details</h2><div className="space-y-4 text-[11px]"><div><strong className="block font-medium text-[#f4dfa8]">Humidor Name</strong><span className="text-[#bda170]">{humidor.name}</span></div><div><strong className="block font-medium text-[#f4dfa8]">Description</strong><p className="mt-1 leading-relaxed text-[#bda170]">This walk-in humidor is designed to preserve cigars in optimal conditions with consistent temperature and humidity. It houses premium collections, new arrivals, and limited releases in a well-organized layout. Products are arranged by designated shelves for quick inventory management and easy access.</p></div><div><strong className="block font-medium text-[#f4dfa8]">Shelf Labels</strong><span className="text-[#bda170]">{humidor.labels.join(", ")}</span></div></div></>}

function DeleteHumidor({close,remove}:{close:()=>void;remove:()=>void}) {return <><h2 className="mb-5 font-playfair text-2xl font-semibold text-[#d5a744]">Delete a Humidor</h2><span className="grid h-8 w-8 place-items-center rounded-full bg-[#6c4a24]"><TriangleAlert size={15} className="text-[#e0ae45]"/></span><h3 className="mt-3 text-xs font-medium">Are You Sure?</h3><p className="mt-1 text-[10px] text-[#c6ad7e]">Are you sure you want to delete this humidor?</p><ModalActions close={close} action="Delete" onAction={remove}/></>}

function ModalActions({close,action,onAction}:{close:()=>void;action:string;onAction?:()=>void}) {return <div className="mt-5 grid grid-cols-2 gap-1.5"><button type="button" onClick={close} className="h-9 rounded-sm border border-[#c8983b] text-[10px]">Cancel</button><button type={onAction?"button":"submit"} onClick={onAction} className="h-9 rounded-sm bg-[#d1a23f] text-[10px] text-[#2e1a09]">{action}</button></div>}
