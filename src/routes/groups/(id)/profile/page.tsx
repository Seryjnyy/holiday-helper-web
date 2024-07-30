import React from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { getGroupUser } from "@/services/group";
import Loading from "@/components/loading";
import ErrorMessage from "@/components/error-message";
import GoBackLeft from "@/components/go-back-left";
import { H1 } from "@/components/ui/typography";

export default function ProfilePage() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["groupUser", id ?? "", user?.id ?? ""],
    queryFn: () => getGroupUser(id ?? "", user?.id ?? ""),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) return <ErrorMessage>{error.message}</ErrorMessage>;

  if (!id) return <div>group id is missing...</div>;

  if (!user) return <div>user data is missing...</div>;

  return (
    <div>
      <div className="flex mb-8 gap-2 items-center px-2">
        <GoBackLeft to={`/groups/${id}`} title="group" />
        <H1>Profile</H1>
      </div>
      <p>{data.name}</p>
      <div>
        <h3>Reason to be on this holiday?</h3>
        <p>...</p>
      </div>
      <div>
        <h3>Last location</h3>
        <div className="border w-20 h-20"></div>
        <div>
          <span>Last updated on </span>
          <span>20:12 - 20/03/2024</span>
        </div>
        <button>Update current location</button>
      </div>
    </div>
  );
}
