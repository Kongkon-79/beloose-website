"use client";

import { getProfileSettings, updateProfileSettings, type UserProfile } from "@/lib/profileInfo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardState from "./DashboardState";
import ProfileHero from "./ProfileHero";
import ProfileSkeleton from "./ProfileSkeleton";

const inputClass = "h-9 w-full rounded border border-[#d5c39b] bg-transparent px-3 text-[11px] text-[#f0ddb0] outline-none placeholder:text-[#aa8e5b] read-only:cursor-default focus:border-[#d2a13d] disabled:opacity-60";
const countries = ["Bangladesh", "Canada", "India", "United Arab Emirates", "United Kingdom", "United States"];
const nationalities = ["Bangladeshi", "British", "Canadian", "Emirati", "Indian", "American"];

export default function ProfileForm() {
  const { data: session, status, update } = useSession();
  const sessionUser = session?.user as { accessToken?: string; profilePicture?: string } | undefined;
  const token = sessionUser?.accessToken;
  const query = useQuery({ queryKey: ["profile-settings"], queryFn: () => getProfileSettings(token!), enabled: Boolean(token) });

  useEffect(() => {
    if (query.data?.profilePicture && query.data.profilePicture !== sessionUser?.profilePicture) void update({ profilePicture: query.data.profilePicture });
  }, [query.data?.profilePicture, sessionUser?.profilePicture, update]);

  if (status === "loading" || query.isLoading || (status === "authenticated" && !token)) return <ProfileSkeleton/>;
  if (query.isError) return <DashboardState type="error" message={query.error instanceof Error ? query.error.message : "Something went wrong while loading your profile."} onRetry={() => query.refetch()}/>;
  if (!query.data) return <DashboardState type="empty" message="Your profile data was not found."/>;
  return <ProfileEditor initialUser={query.data} token={token!}/>;
}

function ProfileEditor({ initialUser, token }: { initialUser: UserProfile; token: string }) {
  const [user, setUser] = useState(() => normalizeUser(initialUser));
  const [savedUser, setSavedUser] = useState(() => normalizeUser(initialUser));
  const [editing, setEditing] = useState<"personal" | "contact" | null>(null);
  const [profilePicture, setProfilePicture] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const queryClient = useQueryClient();
  const { update } = useSession();
  const mutation = useMutation({
    mutationFn: () => updateProfileSettings(token, {
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      businessName: user.businessName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth || undefined,
      country: user.country,
      stateRegion: user.stateRegion,
      nationality: user.nationality,
      postcode: user.postcode,
    }, profilePicture),
    onSuccess: async data => {
      const normalized = normalizeUser(data);
      setUser(normalized); setSavedUser(normalized); setEditing(null); setProfilePicture(undefined);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(undefined); queryClient.setQueryData(["profile-settings"], data);
      await update({ fullName: data.fullName, email: data.email, profilePicture: data.profilePicture });
      toast.success("Profile updated successfully");
    },
    onError: error => toast.error(error instanceof Error ? error.message : "Profile update failed"),
  });
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  const field = (key: keyof UserProfile, value: string) => setUser(current => ({ ...current, [key]: value }));
  const choosePicture = (file?: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setProfilePicture(file); setPreviewUrl(file ? URL.createObjectURL(file) : undefined); setEditing("personal");
  };
  const cancel = () => {
    setUser(savedUser); setEditing(null); setProfilePicture(undefined);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(undefined);
  };
  const submit = (event: FormEvent) => { event.preventDefault(); mutation.mutate(); };
  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.fullName;

  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-4">
    <ProfileHero name={fullName} businessName={user.businessName} profilePicture={previewUrl || user.profilePicture} editable onImageChange={choosePicture}/>
    <form onSubmit={submit} className="mt-4 space-y-4">
      <FormSection title="Personal Information" editing={editing === "personal"} onEdit={() => setEditing("personal")} onCancel={cancel} pending={mutation.isPending}>
        <div className="grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2">
          <Field label="First Name" value={user.firstName || ""} onChange={value => field("firstName", value)} readOnly={editing !== "personal"}/>
          <Field label="Last Name" value={user.lastName || ""} onChange={value => field("lastName", value)} readOnly={editing !== "personal"}/>
          <Field wide label="Shop Name" value={user.businessName || ""} onChange={value => field("businessName", value)} readOnly={editing !== "personal"}/>
          <Field label="Date of Birth" value={user.dateOfBirth?.slice(0, 10) || ""} onChange={value => field("dateOfBirth", value)} type="date" readOnly={editing !== "personal"}/>
          <fieldset className="flex flex-col gap-2 text-[11px]"><legend>Gender</legend><div className="flex h-9 items-center gap-5"><Radio label="Male" checked={user.gender === "male"} disabled={editing !== "personal"} onChange={() => field("gender", "male")}/><Radio label="Female" checked={user.gender === "female"} disabled={editing !== "personal"} onChange={() => field("gender", "female")}/></div></fieldset>
        </div>
      </FormSection>
      <FormSection title="Contact Information" editing={editing === "contact"} onEdit={() => setEditing("contact")} onCancel={cancel} pending={mutation.isPending}>
        <div className="grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2">
          <Field label="Email" value={user.email} onChange={value => field("email", value)} placeholder="Enter your email address" type="email" readOnly={editing !== "contact"}/>
          <Field label="Phone Number" value={user.phoneNumber || ""} onChange={value => field("phoneNumber", value)} placeholder="Enter your phone number" readOnly={editing !== "contact"}/>
          <SelectField label="Country" value={user.country || ""} values={countries} onChange={value => field("country", value)} disabled={editing !== "contact"}/>
          <Field label="State/Region" value={user.stateRegion || ""} onChange={value => field("stateRegion", value)} placeholder="Choose any one" readOnly={editing !== "contact"}/>
          <SelectField label="Nationality" value={user.nationality || ""} values={nationalities} onChange={value => field("nationality", value)} disabled={editing !== "contact"}/>
          <Field label="Postcode" value={user.postcode || ""} onChange={value => field("postcode", value)} placeholder="e.g. 5585" readOnly={editing !== "contact"}/>
          <label className="flex flex-col gap-1.5 text-[11px] sm:col-span-2"><span>Address</span><textarea value={user.address || ""} onChange={event => field("address", event.target.value)} placeholder="Enter your full address" readOnly={editing !== "contact"} className={`${inputClass} h-20 resize-none py-3`}/></label>
        </div>
      </FormSection>
    </form>
  </div>;
}

function normalizeUser(user: UserProfile): UserProfile {
  if (user.firstName || user.lastName) return user;
  const parts = user.fullName.trim().split(/\s+/);
  return { ...user, firstName: parts[0] || "", lastName: parts.slice(1).join(" ") };
}

function FormSection({ title, editing, onEdit, onCancel, pending, children }: { title: string; editing: boolean; onEdit: () => void; onCancel: () => void; pending: boolean; children: React.ReactNode }) {
  return <section className="rounded-md bg-[#59401f] p-4"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold">{title}</h3>{editing ? <div className="flex gap-2"><button type="button" onClick={onCancel} className="h-7 rounded border border-[#b88b35] px-3 text-[9px]">Cancel</button><button disabled={pending} className="h-7 rounded bg-[#d2a13d] px-3 text-[9px] font-semibold text-[#291806]">{pending ? "Saving..." : "Save"}</button></div> : <button type="button" aria-label={`Edit ${title}`} onClick={onEdit} className="text-[#f0d796] transition hover:text-[#d2a13d]"><Pencil size={15}/></button>}</div>{children}</section>;
}
function Field({ label, value, onChange, type = "text", wide, placeholder, readOnly }: { label: string; value: string; onChange: (value: string) => void; type?: string; wide?: boolean; placeholder?: string; readOnly?: boolean }) {
  return <label className={`flex flex-col gap-1.5 text-[11px] ${wide ? "sm:col-span-2" : ""}`}><span>{label}</span><input className={inputClass} type={type} value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} readOnly={readOnly}/></label>;
}
function SelectField({ label, value, values, onChange, disabled }: { label: string; value: string; values: string[]; onChange: (value: string) => void; disabled: boolean }) {
  const options = value && !values.includes(value) ? [value, ...values] : values;
  return <div className="flex flex-col gap-1.5 text-[11px]"><span>{label}</span><Select value={value || undefined} onValueChange={onChange} disabled={disabled}><SelectTrigger aria-label={label} className={`${inputClass} shadow-none`}><SelectValue placeholder="Choose any one" /></SelectTrigger><SelectContent className="border-[#d5c39b] bg-[#3b2918] text-[#f0ddb0]">{options.map(option => <SelectItem className="focus:bg-[#59401f] focus:text-[#f0ddb0]" value={option} key={option}>{option}</SelectItem>)}</SelectContent></Select></div>;
}
function Radio({ label, checked, disabled, onChange }: { label: string; checked: boolean; disabled: boolean; onChange: () => void }) {
  return <label className="flex items-center gap-1 text-[#cfb47e]"><input type="radio" checked={checked} disabled={disabled} onChange={onChange} className="accent-[#d2a13d]"/>{label}</label>;
}
