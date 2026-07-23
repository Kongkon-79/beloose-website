import type { ReactNode } from "react";
import UserNavbar from "./_components/user-navbar";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <UserNavbar />
      {children}
    </>
  );
}
