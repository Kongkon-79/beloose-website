"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { getProfileSettings, updateProfileSettings, type UserProfile } from "@/lib/profileInfo";
import DashboardState from "./DashboardState";
import ProfileSkeleton from "./ProfileSkeleton";

const inputClass = "h-10 w-full rounded border border-[#d4c091] bg-transparent px-3 text-xs text-[#f0ddb0] outline-none placeholder:text-[#a98d5b] focus:border-[#d2a13d] disabled:opacity-60";

export default function ProfileForm() {
  const { data: session, status, update } = useSession();
  const sessionUser = session?.user as { accessToken?: string; profilePicture?: string } | undefined;
  const token = sessionUser?.accessToken;
  const query = useQuery({
    queryKey: ["profile-settings"],
    queryFn: () => getProfileSettings(token!),
    enabled: Boolean(token),
  });
  useEffect(() => {
    if (query.data?.profilePicture && query.data.profilePicture !== sessionUser?.profilePicture) {
      void update({ profilePicture: query.data.profilePicture });
    }
  }, [query.data?.profilePicture, sessionUser?.profilePicture, update]);

  if (status === "loading" || query.isLoading || (status === "authenticated" && !token)) return <ProfileSkeleton/>;
  if (query.isError) return <DashboardState type="error" message={query.error instanceof Error ? query.error.message : "Something went wrong while loading your profile."} onRetry={() => query.refetch()}/>;
  if (!query.data) return <DashboardState type="empty" message="Your profile data was not found."/>;

  return <ProfileEditor user={query.data} token={token!}/>;
}

function ProfileEditor({ user: initialUser, token }: { user: UserProfile; token: string }) {
  const [user, setUser] = useState(initialUser);
  const [profilePicture, setProfilePicture] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const queryClient = useQueryClient();
  const { update } = useSession();
  const mutation = useMutation({
    mutationFn: () => updateProfileSettings(token, {
      fullName: user.fullName,
      businessName: user.businessName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth || undefined,
    }, profilePicture),
    onSuccess: async (data) => {
      setUser(data);
      setProfilePicture(undefined);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(undefined);
      queryClient.setQueryData(["profile-settings"], data);
      await update({ fullName: data.fullName, email: data.email, profilePicture: data.profilePicture });
      toast.success("Profile updated successfully");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Profile update failed"),
  });
  const initials = user.fullName.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
  const imageUrl = previewUrl || user.profilePicture;
  const setUserField = (field: keyof UserProfile, value: string) => setUser(current => ({ ...current, [field]: value }));
  const selectProfilePicture = (file?: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setProfilePicture(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : undefined);
  };
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  const submit = (event: FormEvent) => { event.preventDefault(); mutation.mutate(); };

  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-5">
    <section className="relative overflow-hidden rounded-lg bg-[#261407]"><div className="h-32 bg-[linear-gradient(to_bottom,rgba(0,0,0,.25),rgba(45,26,8,.85)),url('/assets/images/footer_bg.png')] bg-cover bg-center"/><div className="relative -mt-12 flex items-end gap-3 px-4 pb-4"><label className="group relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-[#d2a13d] bg-[#573621]" aria-label="Choose profile image"><span className="grid h-full w-full place-items-center font-playfair text-lg text-[#d5a744]">{imageUrl ? <Image src={imageUrl} alt="Profile" fill sizes="64px" className="object-cover"/> : initials}</span><span className="absolute bottom-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-[#d2a13d] text-[#291806] shadow"><Camera size={13}/></span><input className="sr-only" type="file" accept="image/*" onChange={event => selectProfilePicture(event.target.files?.[0])}/></label><div><h2 className="font-playfair text-xl font-semibold">{user.fullName}</h2><p className="text-[10px] text-[#b89a67]">{user.email}</p><p className="mt-1 text-[9px] text-[#d2a13d]">{profilePicture ? "New image selected · Save changes to upload" : "Click the photo to change profile image"}</p></div></div></section>
    <form onSubmit={submit} className="mt-4 space-y-4">
      <FormSection title="Account Information"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Full Name" value={user.fullName} onChange={value => setUserField("fullName", value)} required/><Field label="Email" value={user.email} type="email" disabled/><Field label="Business Name" value={user.businessName || ""} onChange={value => setUserField("businessName", value)}/><Field label="Date of Birth" value={user.dateOfBirth?.slice(0, 10) || ""} onChange={value => setUserField("dateOfBirth", value)} type="date"/><Field label="Phone Number" value={user.phoneNumber || ""} onChange={value => setUserField("phoneNumber", value)}/><label className="flex flex-col gap-1.5 text-[11px]"><span>Gender</span><select className={inputClass} value={user.gender || ""} onChange={event => setUserField("gender", event.target.value)}><option value="">Not specified</option><option value="male">Male</option><option value="female">Female</option></select></label><Field wide label="Address" value={user.address || ""} onChange={value => setUserField("address", value)}/></div></FormSection>
      <div className="flex justify-end"><button disabled={mutation.isPending} className="h-10 rounded bg-[#d2a13d] px-6 text-xs font-semibold text-[#291806] disabled:cursor-not-allowed disabled:opacity-60">{mutation.isPending ? "Saving..." : "Save Changes"}</button></div>
    </form>
  </div>;
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-lg bg-[#59401f] p-4"><h3 className="mb-4 text-sm font-semibold">{title}</h3>{children}</section>; }
function Field({ label, value, onChange, type = "text", wide, required, disabled }: { label: string; value: string; onChange?: (value: string) => void; type?: string; wide?: boolean; required?: boolean; disabled?: boolean }) { return <label className={`flex flex-col gap-1.5 text-[11px] ${wide ? "sm:col-span-2" : ""}`}><span>{label}</span><input className={inputClass} type={type} value={value} onChange={event => onChange?.(event.target.value)} required={required} disabled={disabled}/></label>; }
