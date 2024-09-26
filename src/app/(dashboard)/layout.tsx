import { onLoginUser } from "@/actions/auth";
import { redirectToSignIn } from "@clerk/nextjs";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const OwnerLayout = async ({ children }: Props) => {
  const authenticated = await onLoginUser();
  if (!authenticated) redirectToSignIn();

  return <div className="flex h-screen w-full">OwnerLayout</div>;
};

export default OwnerLayout;
