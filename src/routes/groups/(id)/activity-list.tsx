import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Loading from "@/components/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H3, H4 } from "@/components/ui/typography";
import { toDateString, toTimeString } from "@/lib/utils";
import { getGroupActivity, getGroupUsers } from "@/services/group";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// TODO : Types copied from db types, but if db is updated this wont get changed automatically
const getContentBasedOnChargeType = (
  chargeType:
    | "user_join"
    | "user_leave"
    | "user_removed"
    | "user_added"
    | "charge_created"
    | "charge_modified"
    | "charge_deleted"
) => {
  switch (chargeType) {
    case "charge_created":
      return "Created a new charge.";
  }
};

export default function ActivityList({ groupID }: { groupID: string }) {
  // TODO : maybe do refetch on refocus
  const groupActivity = useQuery({
    queryKey: ["groupActivity", groupID ?? ""],
    queryFn: () => getGroupActivity(groupID ?? ""),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const groupUsers = useQuery({
    queryKey: ["groupUsers", groupID ?? ""],
    queryFn: () => getGroupUsers(groupID ?? ""),
  });

  if (groupActivity.isPending) {
    return <Loading />;
  }

  if (groupUsers.isPending) {
    return <Loading />;
  }

  if (groupActivity.isError)
    return <div>Error {groupActivity.error.message}</div>;

  if (groupUsers.isError) return <div>Error {groupUsers.error.message}</div>;

  return (
    <Card className="border p-2">
      <CardHeader>
        <CardTitle>
          <H3>Activity list</H3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {groupActivity.data.map((activity) => {
          const creatorProfile = groupUsers.data.find(
            (groupUser) => groupUser.user_id == activity.creator_id
          );

          return (
            <div
              key={activity.id}
              className="border p-4 flex flex-col gap-2 rounded-md"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="relative">
                    <H4 className="min-w-[14rem]">{creatorProfile?.name}</H4>
                    <span className="absolute text-xs text-muted">
                      {activity.creator_id}
                    </span>
                  </div>
                </div>
                <Button variant={"secondary"}>
                  <Eye />
                </Button>
              </div>
              <p className="pl-8">
                {getContentBasedOnChargeType(activity.type)}
              </p>
              <span>{JSON.stringify(activity.extras)}</span>
              <div className="space-x-2 text-xs text-muted ml-auto">
                <span>{toDateString(activity.created_at)}</span>
                <span>{toTimeString(activity.created_at)}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
