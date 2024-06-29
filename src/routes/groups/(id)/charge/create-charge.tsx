import GoBackLeft from "@/components/go-back-left";
import React from "react";

export default function CreateCharge({ id }: { id: string }) {
  return (
    <div>
      <GoBackLeft title="group" to={`/groups/${id}`} />
    </div>
  );
}
