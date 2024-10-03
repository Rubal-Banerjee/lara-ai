import { onGetAllAccountDomains } from "@/actions/settings";
import ConversationMenu from "@/components/conversations";
import Infobar from "@/components/infobar";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import React from "react";

const ConversationPage = async () => {
  const domains = await onGetAllAccountDomains();

  return (
    <div className="w-full h-full flex">
      <ConversationMenu domains={domains?.domains} />
      <Separator orientation="vertical" />
      <div className="w-full flex flex-col">
        <div className="px-5">
          <Infobar />
        </div>
        {/* <Messenger /> */}
      </div>
    </div>
  );
};

export default ConversationPage;
