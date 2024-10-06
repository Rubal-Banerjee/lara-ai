import { onLoginUser } from "@/actions/auth";
import SideBar from "@/components/sidebar";
import { redirectToSignIn } from "@clerk/nextjs";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const OwnerLayout = async ({ children }: Props) => {
  const authenticated = await onLoginUser();
  if (!authenticated) redirectToSignIn();

  return (
    <div className="flex w-full h-screen">
      <SideBar domains={authenticated?.domain} />
      <div className="w-full h-screen flex flex-col pl-20 md:pl-4">
        {children}
      </div>
    </div>
  );
};

export default OwnerLayout;
