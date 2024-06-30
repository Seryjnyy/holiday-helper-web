import { getGroupUsers } from "@/services/group";
import { useQuery } from "@tanstack/react-query";

import Loading from "@/components/loading";
import useAuthStore from "@/stores/auth-store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H3, H4 } from "@/components/ui/typography";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarUser from "@/components/ui/avatar-user";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function GroupUserList({ id }: { id: string }) {
  const user = useAuthStore((state) => state.user);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["groupUsers", id ?? ""],
    queryFn: () => getGroupUsers(id ?? ""),
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) return <div>Error {error.message}</div>;

  return (
    <Card className="p-2 border">
      <CardHeader>
        <CardTitle>
          <H3>Group user list</H3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((groupUser) => {
          const isUs = user != null && user?.id == groupUser.user_id;

          return (
            <div className="flex items-center gap-2 bg-secondary p-4 rounded-sm">
              <AvatarUser name="" isUs={isUs} role="user" />
              <div className="relative">
                <H4 className="min-w-[14rem]">{groupUser.name}</H4>
                <span className="absolute text-xs text-muted-foreground">
                  {groupUser.id}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Link
          to={`create-user`}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Create user
        </Link>
      </CardFooter>
    </Card>
  );
}
