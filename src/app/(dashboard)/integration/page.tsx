import { onGetPaymentConnected } from "@/actions/settings";
import Infobar from "@/components/infobar";
import IntegrationsList from "@/components/integrations";
import React from "react";

const IntegrationsPage = async () => {
  const payment = await onGetPaymentConnected();

  // Create an object of connections
  const connections = {
    stripe: payment ? true : false,
  };

  return (
    <>
      <Infobar />
      <IntegrationsList connections={connections} />
    </>
  );
};

export default IntegrationsPage;
