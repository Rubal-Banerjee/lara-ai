import Infobar from "@/components/infobar";
import BillingSettings from "@/components/settings/billing-settings";
import ChangePassword from "@/components/settings/change-password";
import DarKModeToggle from "@/components/settings/dark-mode";
import React from "react";

const Page = () => {
  return (
    <>
      <Infobar />
      <div className="overflow-y-auto w-full chat-window flex-1 h-0 flex flex-col gap-10">
        <BillingSettings />
        <DarKModeToggle />
        <ChangePassword />
      </div>
    </>
  );
};

export default Page;
