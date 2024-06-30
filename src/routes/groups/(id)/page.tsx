import GoBackLeft from "@/components/go-back-left";
import { getGroup, getGroupUsers } from "@/services/group";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import Loading from "@/components/loading";
import { CircleUser, User } from "lucide-react";
import ChargePage from "./charge/page";
import ActivityList from "./activity-list";
import GroupUserList from "../group-user-list";
import { H1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export default function GroupPage() {
  let { id } = useParams();
  const navigate = useNavigate();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["group", id ?? ""],
    queryFn: () => getGroup(id ?? ""),
  });

  if (!id) {
    return <div>group id is missing.</div>;
  }

  if (isPending) {
    return <Loading />;
  }

  if (isError) return <div>Error {error.message}</div>;

  return (
    <div>
      <div className="flex mb-8 justify-between items-center px-2">
        <div className="flex items-center gap-2 ">
          <GoBackLeft title="groups" to="/groups" />
          <div className="relative">
            <H1>Name {data?.name}</H1>
            <span className="text-xs text-muted absolute">{"" + id}</span>
          </div>
        </div>
        <Button onClick={() => navigate("profile")} variant={"outline"}>
          <User />
        </Button>
      </div>

      <div className="flex flex-col gap-2 px-2">
        <GroupUserList id={id} />
        <ActivityList groupID={id} />
        <Button className="w-fit" onClick={() => navigate("charge")}>
          Create charge
        </Button>
      </div>
    </div>
  );
}
