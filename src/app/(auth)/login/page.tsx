
import React, { Suspense } from "react";
import AuthLayoutDesign from "../_components/authLayout";
import LoginForm from "./components/loginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";


const LoginPage = async () => {
  const session = await getServerSession(authOptions);

  if ((session?.user as { role?: string } | undefined)?.role === "retailer") {
    redirect("/retailer-dashboard");
  }

  return (
    <div>
      <AuthLayoutDesign>
         <Suspense fallback={<div>Loading...</div>}>
        <LoginForm/>
         </Suspense>
      </AuthLayoutDesign>
    </div>
  );
};

export default LoginPage;
