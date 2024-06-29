import GoBackLeft from "@/components/go-back-left";
import { getGroup, getGroupUsers } from "@/services/group";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import Loading from "@/components/loading";
import { CircleUser } from "lucide-react";
import ChargePage from "./charge/page";

const GroupUsers = ({ id }: { id: string }) => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["groupUsers", id ?? ""],
    queryFn: () => getGroupUsers(id ?? ""),
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) return <div>Error {error.message}</div>;

  return (
    <div>
      {data.map((groupUser) => (
        <div key={groupUser.id}>{groupUser.name}</div>
      ))}
    </div>
  );
};

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
      <div className="flex justify-between items-center px-4">
        <GoBackLeft title="groups" to="/groups" />
        <div className="cursor-pointer" onClick={() => navigate("profile")}>
          <CircleUser />
        </div>
      </div>
      <h1>some group name</h1>
      <div className="flex gap-8">
        <span>{"" + id}</span>
        <span>{data?.name}</span>
      </div>
      <GroupUsers id={id} />
      <button onClick={() => navigate("charge")}>Create charge</button>
    </div>
  );
}
