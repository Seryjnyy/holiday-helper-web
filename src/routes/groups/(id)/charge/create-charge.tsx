import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import Loading from "@/components/loading";
import AvatarUser from "@/components/ui/avatar-user";
import { Button } from "@/components/ui/button";
import { NumberFormatInput } from "@/components/ui/number-format-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { H4 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { getGroupUsers } from "@/services/group";
import useAuthStore from "@/stores/auth-store";
import { GroupUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function CreateCharge({ groupID }: { groupID: string }) {
  const [price, setPrice] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<GroupUser[]>([]);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [userSplit, setUserSplit] = useState<{ id: string; amount: number }[]>(
    []
  );

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

  const onToggleUser = (groupUser: GroupUser) => {
    const isSelected = selectedUsers.find((x) => x.id == groupUser.id) != null;

    if (!isSelected) {
      setSelectedUsers((prev) => [...prev, groupUser]);
    } else {
      setSelectedUsers((prev) => prev.filter((x) => x.id != groupUser.id));
    }
  };

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
          <div className=" bg-background py-2 px-4 rounded-md ">2 people</div>
        </div>
        <div></div>
      </div>

      <div className="">
        <NumberFormatInput
          prefix="$"
          allowNegative={false}
          allowLeadingZeros={false}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      <div className="flex justify-center ">
        <div className="w-fit bg-secondary p-3 flex items-center rounded-sm gap-2">
          <span className="font-bold">split</span>
          <div className="flex">
            <ToggleGroup
              type="single"
              value={splitType}
              onValueChange={(val) => {
                if (val != "equal" && val != "custom") return;

                setSplitType(val);
              }}
            >
              <ToggleGroupItem value="equal" aria-label="Toggle equal">
                equal
              </ToggleGroupItem>
              <ToggleGroupItem value="custom" aria-label="Toggle custom">
                custom
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      <div>
        {data.map((groupUser) => {
          const isUs = user != null && user?.id == groupUser.user_id;
          const isSelected =
            selectedUsers.find((x) => x.id == groupUser.id) != null;

          const split =
            selectedUsers.length == 0 ? 0 : price / selectedUsers.length;

          return (
            <div
              className={cn(
                "flex items-center bg-secondary  gap-2 p-4 rounded-sm cursor-pointer",
                {
                  "border-2": isSelected,
                }
              )}
              onClick={onToggleUser}
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
              {isSelected && split}
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
