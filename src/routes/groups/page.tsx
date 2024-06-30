import React from "react";
import CreateGroup from "./create-group";
import GroupList from "./group-list";
import { H1 } from "@/components/ui/typography";

export default function GroupsPage() {
  return (
    <div>
      <div className="px-2 mb-8">
        <H1>Groups</H1>
      </div>
      {/* <CreateGroup /> */}
      <GroupList />
    </div>
  );
}
