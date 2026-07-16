import { KeyRound, UserRound } from "lucide-react";
import Link from "next/link";

export default function SettingsMenu(){return <div className="min-h-[calc(100vh-72px)] space-y-3 bg-[#3b2918] p-4 sm:p-5">{[["Profile",UserRound,"/retailer-dashboard/settings/profile"],["Password",KeyRound,"/retailer-dashboard/settings/password"]].map(([label,Icon,href])=><Link href={href as string} key={label as string} className="flex h-14 items-center gap-3 rounded bg-[#34200e] px-4 text-sm font-semibold no-underline transition hover:translate-x-1 hover:bg-[#513719] hover:text-[#f4dfa8] hover:no-underline"><Icon size={17}/>{label as string}</Link>)}</div>}
