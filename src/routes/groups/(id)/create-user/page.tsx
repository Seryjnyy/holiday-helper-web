import GoBackLeft from "@/components/go-back-left";
import { H1 } from "@/components/ui/typography";
import React from "react";
import { useParams } from "react-router-dom";
import CreateUser from "./create-user";

// TODO : should be restricted to only admins
export default function CreateUserPage() {
  let { id } = useParams();

  if (!id) {
    return <div>group id is missing.</div>;
  }

  return (
    <div>
      <div className="px-2 flex gap-2 items-center mb-8">
        <GoBackLeft title="group" to={`/groups/${id}`} />
        <H1>Create user</H1>
      </div>
      <div className="px-2">
        <CreateUser />
      </div>
    </div>
  );
}
