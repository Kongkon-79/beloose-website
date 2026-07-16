"use client";

import { Pencil } from "lucide-react";

const inputClass = "h-10 w-full rounded border border-[#d4c091] bg-transparent px-3 text-xs text-[#f0ddb0] outline-none placeholder:text-[#a98d5b] focus:border-[#d2a13d]";

export default function ProfileForm() {
  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-5">
    <section className="relative overflow-hidden rounded-lg bg-[#261407]">
      <div className="h-32 bg-[linear-gradient(to_bottom,rgba(0,0,0,.25),rgba(45,26,8,.85)),url('/assets/images/footer_bg.png')] bg-cover bg-center" />
      <div className="relative -mt-12 flex items-end gap-3 px-4 pb-4"><span className="grid h-16 w-16 place-items-center rounded-lg border border-[#d2a13d] bg-[#573621] font-playfair text-lg text-[#d5a744]">CL</span><div><h2 className="font-playfair text-xl font-semibold">The Cigar Lounge</h2><p className="text-[10px] text-[#b89a67]">Premium Retailer · Humidor411 Partner</p></div></div>
    </section>
    <form onSubmit={event=>event.preventDefault()} className="mt-4 space-y-4">
      <FormSection title="Personal Information"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="First Name" value="Cody"/><Field label="Last Name" value="Fisher"/><Field wide label="Shop Name" value="Opus X Perfeccion X"/><Field label="Date of Birth" placeholder="DD/MM/YYYY" type="date"/><fieldset className="flex items-end gap-5 pb-2 text-xs"><legend className="mb-3">Gender</legend><label className="flex gap-1.5"><input name="gender" type="radio"/> Male</label><label className="flex gap-1.5"><input name="gender" type="radio"/> Female</label></fieldset></div></FormSection>
      <FormSection title="Contact Information"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Email" placeholder="Enter your email address" type="email"/><Field label="Phone Number" placeholder="Enter your phone number"/><SelectField label="Country"/><SelectField label="State/Region"/><SelectField label="Nationality"/><Field label="Postcode" placeholder="e.g. 5585"/><label className="flex flex-col gap-1.5 text-[11px] sm:col-span-2"><span>Address</span><textarea className="min-h-24 rounded border border-[#d4c091] bg-transparent p-3 text-xs outline-none focus:border-[#d2a13d]" placeholder="Enter your full address"/></label></div></FormSection>
      <div className="flex justify-end"><button className="h-10 rounded bg-[#d2a13d] px-6 text-xs text-[#291806]">Save Changes</button></div>
    </form>
  </div>;
}

function FormSection({title,children}:{title:string;children:React.ReactNode}){return <section className="rounded-lg bg-[#59401f] p-4"><div className="mb-4 flex justify-between"><h3 className="text-sm font-semibold">{title}</h3><Pencil size={16}/></div>{children}</section>}
function Field({label,value,placeholder,type="text",wide}:{label:string;value?:string;placeholder?:string;type?:string;wide?:boolean}){return <label className={`flex flex-col gap-1.5 text-[11px] ${wide?"sm:col-span-2":""}`}><span>{label}</span><input className={inputClass} type={type} defaultValue={value} placeholder={placeholder}/></label>}
function SelectField({label}:{label:string}){return <label className="flex flex-col gap-1.5 text-[11px]"><span>{label}</span><select className={inputClass} defaultValue=""><option value="" disabled>Choose any one</option><option>United States</option><option>United Kingdom</option><option>Bangladesh</option></select></label>}
