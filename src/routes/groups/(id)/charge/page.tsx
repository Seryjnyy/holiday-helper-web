import React from "react";
import CreateCharge from "./create-charge";
import { useParams } from "react-router-dom";
import ErrorMessage from "@/components/error-message";

export default function ChargePage() {
  let { id } = useParams();

  if (!id) return <ErrorMessage>Group ID is missing.</ErrorMessage>;

  return (
    <div>
      Charge page
      <CreateCharge id={id} />
    </div>
  );
}
