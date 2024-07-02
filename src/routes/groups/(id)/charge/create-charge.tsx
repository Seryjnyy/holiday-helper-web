import GoBackLeft from "@/components/go-back-left";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { getGroupUsers } from "@/services/group";
import useAuthStore from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import AvatarUser from "@/components/ui/avatar-user";
import { H4, P } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { NumberFormatInput } from "@/components/ui/number-format-input";
import { GroupUser } from "@/types";
import { cn } from "@/lib/utils";

export default function CreateCharge({ groupID }: { groupID: string }) {
  const [price, setPrice] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<GroupUser[]>([]);

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
    <div className="px-4 space-y-12">
      <div className="p-4 rounded-md bg-secondary flex flex-col items-center">
        <div className="flex items-center text-lg font-bold">
          <div className="p-[20px] box-border bg-background w-[1.5rem] h-[1.5rem] flex justify-center items-center rounded-md">
            {"$"}
          </div>
          <div className="bg-background  py-2 rounded-lg flex items-center min-w-[8rem] justify-center">
            {price}
          </div>
        </div>
        <NumberFormatInput
          prefix="$"
          allowNegative={false}
          allowLeadingZeros={false}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      <div>
        {data.map((groupUser) => {
          const isUs = user != null && user?.id == groupUser.user_id;
          const isSelected =
            selectedUsers.find((x) => x.id == groupUser.id) != null;

          return (
            <div
              className={cn(
                "flex items-center bg-secondary-foreground gap-2 p-4 rounded-sm ",
                { "cursor-pointer  bg-secondary": !isSelected }
              )}
              onClick={() => {
                if (!isSelected) {
                  setSelectedUsers((prev) => [...prev, groupUser]);
                }
              }}
            >
              {isSelected ? "true" : "false"}
              <AvatarUser
                name={groupUser.name ?? ""}
                isUs={isUs}
                role={groupUser.role}
              />
              <div className="relative">
                <H4 className="min-w-[14rem]">{groupUser.name}</H4>
                <span className="absolute text-xs text-muted-foreground">
                  {groupUser.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>

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
      {/* <Input type="number" /> */}
      <Button>
        {/* <PlusIcon /> */}
        Add receipt
      </Button>
      <Button>Create charge</Button>
    </div>
  );
}
