import { getGroupsForUser } from "@/services/group";

import UserMissingError from "@/components/user-missing-error";

import Loading from "@/components/loading";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { H2, H3 } from "@/components/ui/typography";
import { cn, toDateString, toTimeString } from "@/lib/utils";
import useAuthStore from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function GroupList() {
  const user = useAuthStore((state) => state.user);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["groups", user?.id ?? ""],
    queryFn: () => getGroupsForUser(user?.id ?? ""),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) return <div>Error {error.message}</div>;

  if (!user) return <UserMissingError />;

  // const getGroups = async () => {
  //   const { data, error } = await getGroupsForUser(user.id);
  //   if (data) {
  //     console.log("🚀 ~ getGroups ~ data:", data);

  //     setGroups(
  //       data.filter((group) => group.group != null).map((group) => group.group)
  //     );
  //   }
  // };

  return (
    <div className="px-2">
      <div className="mb-4">
        <H2 className="w-fit">Group list</H2>
      </div>
      <div>
        {data.map((entry) => {
          if (!entry.group) return <></>;

          return (
            <Card key={entry.group.id}>
              <CardContent className="flex justify-between items-center mt-4">
                <div>
                  <H3>{entry.group.name}</H3>
                  <p>{entry.group.description}</p>
                </div>
                <Link
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "group"
                  )}
                  to={entry.group.id}
                >
                  <ArrowRight className="group-hover:translate-x-1 transition-all" />
                </Link>
              </CardContent>
              <CardFooter className="text-xs text-muted flex items-center justify-between">
                <div className="space-x-2">
                  <span>{toDateString(entry.group.created_at)}</span>
                  <span>{toTimeString(entry.group.created_at)}</span>
                </div>
                <span>creatorID: {entry.group.creator_id}</span>
                <span>groupID: {entry.group.id}</span>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
