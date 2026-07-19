"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { getRetailerSettings, updateRetailerSettings, type RetailerProfile, type UserProfile } from "@/lib/profileInfo";
import DashboardState from "./DashboardState";
import ProfileSkeleton from "./ProfileSkeleton";

const inputClass = "h-10 w-full rounded border border-[#d4c091] bg-transparent px-3 text-xs text-[#f0ddb0] outline-none placeholder:text-[#a98d5b] focus:border-[#d2a13d] disabled:opacity-60";

export default function ProfileForm() {
  const { data: session, status } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)?.accessToken;
  const query = useQuery({
    queryKey: ["retailer-settings"],
    queryFn: () => getRetailerSettings(token!),
    enabled: Boolean(token),
  });

  if (status === "loading" || query.isLoading || (status === "authenticated" && !token)) return <ProfileSkeleton/>;
  if (query.isError) return <DashboardState type="error" message={query.error instanceof Error ? query.error.message : "Something went wrong while loading your profile."} onRetry={() => query.refetch()}/>;
  if (!query.data?.user || !query.data.retailer) return <DashboardState type="empty" message="Your retailer shop profile has not been created yet. Complete retailer onboarding first, then return to settings."/>;

  return <ProfileEditor user={query.data.user} retailer={query.data.retailer} token={token!}/>;
}

function ProfileEditor({ user: initialUser, retailer: initialRetailer, token }: { user: UserProfile; retailer: RetailerProfile; token: string }) {
  const [user, setUser] = useState(initialUser);
  const [retailer, setRetailer] = useState(initialRetailer);
  const queryClient = useQueryClient();
  const { update } = useSession();
  const mutation = useMutation({
    mutationFn: () => updateRetailerSettings(token, {
      fullName: user.fullName,
      businessName: user.businessName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth || undefined,
    }, {
      storeName: retailer.storeName,
      address: retailer.address,
      phoneNumber: retailer.phoneNumber,
      city: retailer.city,
      description: retailer.description,
    }),
    onSuccess: async (data) => {
      setUser(data.user);
      setRetailer(data.retailer);
      queryClient.setQueryData(["retailer-settings"], data);
      await update({ fullName: data.user.fullName, email: data.user.email });
      toast.success("Profile updated successfully");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Profile update failed"),
  });
  const initials = (retailer.storeName || user.fullName).split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
  const setUserField = (field: keyof UserProfile, value: string) => setUser(current => ({ ...current, [field]: value }));
  const setRetailerField = (field: keyof RetailerProfile, value: string) => setRetailer(current => ({ ...current, [field]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); mutation.mutate(); };

  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-5">
    <section className="relative overflow-hidden rounded-lg bg-[#261407]"><div className="h-32 bg-[linear-gradient(to_bottom,rgba(0,0,0,.25),rgba(45,26,8,.85)),url('/assets/images/footer_bg.png')] bg-cover bg-center"/><div className="relative -mt-12 flex items-end gap-3 px-4 pb-4"><span className="grid h-16 w-16 place-items-center rounded-lg border border-[#d2a13d] bg-[#573621] font-playfair text-lg text-[#d5a744]">{initials}</span><div><h2 className="font-playfair text-xl font-semibold">{retailer.storeName}</h2><p className="text-[10px] text-[#b89a67]">Premium Retailer · {retailer.status || "pending"}</p></div></div></section>
    <form onSubmit={submit} className="mt-4 space-y-4">
      <FormSection title="Account Information"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Full Name" value={user.fullName} onChange={value => setUserField("fullName", value)} required/><Field label="Email" value={user.email} onChange={value => setUserField("email", value)} type="email" required/><Field label="Business Name" value={user.businessName || ""} onChange={value => setUserField("businessName", value)}/><Field label="Date of Birth" value={user.dateOfBirth?.slice(0, 10) || ""} onChange={value => setUserField("dateOfBirth", value)} type="date"/><Field label="Phone Number" value={user.phoneNumber || ""} onChange={value => setUserField("phoneNumber", value)}/><label className="flex flex-col gap-1.5 text-[11px]"><span>Gender</span><select className={inputClass} value={user.gender || ""} onChange={event => setUserField("gender", event.target.value)}><option value="">Not specified</option><option value="male">Male</option><option value="female">Female</option></select></label><Field wide label="Address" value={user.address || ""} onChange={value => setUserField("address", value)}/></div></FormSection>
      <FormSection title="Shop Information"><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Shop Name" value={retailer.storeName} onChange={value => setRetailerField("storeName", value)} required/><Field label="City" value={retailer.city} onChange={value => setRetailerField("city", value)} required/><Field label="Shop Phone" value={retailer.phoneNumber} onChange={value => setRetailerField("phoneNumber", value)} required/><Field label="Shop Address" value={retailer.address} onChange={value => setRetailerField("address", value)} required/><label className="flex flex-col gap-1.5 text-[11px] sm:col-span-2"><span>Description</span><textarea className="min-h-24 rounded border border-[#d4c091] bg-transparent p-3 text-xs outline-none focus:border-[#d2a13d]" value={retailer.description || ""} onChange={event => setRetailerField("description", event.target.value)} placeholder="Tell customers about your shop"/></label></div></FormSection>
      <div className="flex justify-end"><button disabled={mutation.isPending} className="h-10 rounded bg-[#d2a13d] px-6 text-xs font-semibold text-[#291806] disabled:cursor-not-allowed disabled:opacity-60">{mutation.isPending ? "Saving..." : "Save Changes"}</button></div>
    </form>
  </div>;
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-lg bg-[#59401f] p-4"><h3 className="mb-4 text-sm font-semibold">{title}</h3>{children}</section>; }
function Field({ label, value, onChange, type = "text", wide, required }: { label: string; value: string; onChange: (value: string) => void; type?: string; wide?: boolean; required?: boolean }) { return <label className={`flex flex-col gap-1.5 text-[11px] ${wide ? "sm:col-span-2" : ""}`}><span>{label}</span><input className={inputClass} type={type} value={value} onChange={event => onChange(event.target.value)} required={required}/></label>; }
