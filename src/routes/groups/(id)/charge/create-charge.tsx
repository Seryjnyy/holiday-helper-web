import GoBackLeft from "@/components/go-back-left";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { getGroupUsers } from "@/services/group";
import useAuthStore from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function CreateCharge({ groupID }: { groupID: string }) {
  const user = useAuthStore((state) => state.user);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["groupUsers", groupID ?? ""],
    queryFn: () => getGroupUsers(groupID ?? ""),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return <Loading />;
  }

  if (isError) return <div>Error {error.message}</div>;

  return (
    <div>
      {data.map((groupUser) => {
        const isUs = user && user?.id == groupUser.user_id;

        return (
          <Card key={groupUser.id} className="p-2 border">
            <span>{groupUser.name}</span>
            <span>{isUs ? "(You)" : ""}</span>
          </Card>
        );
      })}
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Charge type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="taxi">🚕 Taxi</SelectItem>
          <SelectItem value="food">🍽️ Food</SelectItem>
          <SelectItem value="bus">🚌 Bus</SelectItem>
        </SelectContent>
      </Select>
      <Button>
        <PlusIcon />
        Add receipt
      </Button>
      <Button>Create charge</Button>
    </div>
  );
}
