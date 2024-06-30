import React from "react";
import CreateCharge from "./create-charge";
import { useParams } from "react-router-dom";
import ErrorMessage from "@/components/error-message";
import GoBackLeft from "@/components/go-back-left";
import { H1 } from "@/components/ui/typography";

export default function ChargePage() {
  let { id } = useParams();

  if (!id) return <ErrorMessage>Group ID is missing.</ErrorMessage>;

  return (
    <div>
      <div className="flex gap-2 items-center mb-8 px-2">
        <GoBackLeft title="group" to={`/groups/${id}`} />
        <H1>Charge page</H1>
      </div>
      <CreateCharge groupID={id} />
    </div>
  );
}
