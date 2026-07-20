"use client";

import { changePassword } from "@/lib/profileInfo";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import DashboardState from "./DashboardState";
import ProfileSkeleton from "./ProfileSkeleton";

export default function PasswordForm() {
  const { data: session, status } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)?.accessToken;
  const [values, setValues] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const mutation = useMutation({
    mutationFn: () => changePassword(token!, values),
    onSuccess: (data) => {
      toast.success(data?.message || "Password updated successfully");
      setValues({ oldPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Password update failed"),
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (values.newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    if (values.newPassword !== values.confirmPassword) return toast.error("New passwords do not match");
    mutation.mutate();
  };

  if (status === "loading") return <ProfileSkeleton/>;
  if (!token) return <DashboardState type="error" message="Your session token is missing. Please log in again."/>;

  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-5"><section className="rounded-lg border border-[#6d512f] bg-[#2d1a08] p-5"><div className="mb-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#513719] text-[#d7a73c]"><KeyRound size={20}/></span><div><h2 className="font-playfair text-xl font-semibold">Change password</h2><p className="mt-1 text-xs text-[#b89a67]">Use a strong password you do not use elsewhere.</p></div></div><form onSubmit={submit} className="max-w-2xl space-y-4"><PasswordField label="Current Password" value={values.oldPassword} onChange={oldPassword => setValues(current => ({ ...current, oldPassword }))}/><PasswordField label="New Password" value={values.newPassword} onChange={newPassword => setValues(current => ({ ...current, newPassword }))}/><PasswordField label="Confirm New Password" value={values.confirmPassword} onChange={confirmPassword => setValues(current => ({ ...current, confirmPassword }))}/>{mutation.isError && <p role="alert" className="rounded border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">{mutation.error instanceof Error ? mutation.error.message : "Password update failed"}</p>}<div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setValues({ oldPassword: "", newPassword: "", confirmPassword: "" })} className="h-10 min-w-28 rounded border border-[#d2a13d] text-xs">Clear</button><button disabled={mutation.isPending} className="h-10 min-w-32 rounded bg-[#d2a13d] text-xs font-semibold text-[#291806] disabled:opacity-60">{mutation.isPending ? "Saving..." : "Save Changes"}</button></div></form></section></div>;
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [show, setShow] = useState(false);
  return <label className="relative flex flex-col gap-1.5 text-[11px]"><span>{label}</span><input required minLength={6} type={show ? "text" : "password"} value={value} onChange={event => onChange(event.target.value)} className="h-11 w-full rounded border border-[#d4c091] bg-transparent px-3 pr-11 text-xs outline-none focus:border-[#d2a13d]"/><button type="button" onClick={() => setShow(current => !current)} aria-label={show ? "Hide password" : "Show password"} className="absolute bottom-3 right-3 text-[#b89a67]">{show ? <EyeOff size={16}/> : <Eye size={16}/>}</button></label>;
}
