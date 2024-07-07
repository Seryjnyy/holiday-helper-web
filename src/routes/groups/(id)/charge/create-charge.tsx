import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import GoBackLeft from "@/components/go-back-left";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { getGroupUsers } from "@/services/group";
import useAuthStore from "@/stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, PlusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import AvatarUser from "@/components/ui/avatar-user";
import { H4, P } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { NumberFormatInput } from "@/components/ui/number-format-input";
import { GroupUser } from "@/types";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { SplitType } from "@/types";

type Split = "equal" | "custom";

const CreateChargeSchema = z.object({
    type: z.string().max(20, "Less"),
    name: z.string().max(60, "Less!!!"),
    notes: z.string().max(200, "Less"),
    price: z.number().positive("What?").finite().safe(),
    splitType: z.enum(["custom", "equal"]),
    split: z
        .object({
            groupUserID: z.string().uuid(),
            amount: z.number().positive().finite().safe(),
        })
        .array(),
});

type CreateChargeSchemaType = z.infer<typeof CreateChargeSchema>;

const UserRow = ({
    groupUser,
    isUs,
    isSelected,
    onToggleUser,
    children,
}: {
    groupUser: GroupUser;
    isUs: boolean;
    isSelected: boolean;
    onToggleUser: (groupUser: GroupUser) => void;
    children?: ReactNode;
}) => {
    return (
        <div
            key={groupUser.id}
            className={cn(
                "flex items-center bg-secondary justify-between  gap-2 p-4 rounded-sm"
            )}
        >
            <div className="flex items-center">
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
                {children}
            </div>
            <div
                className={cn("w-8 h-8  rounded-lg border-2  cursor-pointer", {
                    "bg-secondary-foreground": isSelected,
                })}
                onClick={() => onToggleUser(groupUser)}
            ></div>
        </div>
    );
};

type CurrentTabs = "details" | "price-and-type" | "split" | "review";

export default function CreateCharge({ groupID }: { groupID: string }) {
    const [currentTab, setCurrentTab] = useState<CurrentTabs>("details");
    const [price, setPrice] = useState(0);
    const [selectedUsers, setSelectedUsers] = useState<
        { user: GroupUser; amount: number }[]
    >([]);
    const [splitType, setSplitType] = useState<Split>("equal");
    const [searchTerm, setSearchTerm] = useState("");

    const user = useAuthStore((state) => state.user);
    const { isPending, isError, data, error } = useQuery({
        queryKey: ["groupUsers", groupID ?? ""],
        queryFn: () => getGroupUsers(groupID ?? ""),
        retry: false,
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        setSelectedUsers((prev) => {
            const split = price / prev.length;
            return prev.map((x) => ({ ...x, amount: split }));
        });
    }, [price]);

    if (isPending) {
        return <Loading />;
    }

    if (isError) return <div>Error {error.message}</div>;

    const onToggleUser = (groupUser: GroupUser) => {
        const isSelected =
            selectedUsers.find((x) => x.user.id == groupUser.id) != null;

        if (!isSelected) {
            if (splitType == "equal") {
                setSelectedUsers((prev) => {
                    const split = price == 0 ? 0 : price / (prev.length + 1);
                    console.log(
                        price,
                        prev.length + 1,
                        split,
                        price / (prev.length + 1)
                    );
                    console.log(12 / 2);
                    prev.push({ user: groupUser, amount: split });
                    return prev.map((x) => ({ ...x, amount: split }));
                });
            } else {
                setSelectedUsers((prev) => {
                    prev.push({ user: groupUser, amount: 0 });
                    return prev.map((x) => ({ ...x }));
                });
            }
        } else {
            if (splitType == "equal") {
                setSelectedUsers((prev) => {
                    const rest = prev.filter((x) => x.user.id != groupUser.id);
                    const split = rest.length == 0 ? 0 : price / rest.length;
                    return rest.map((x) => ({ ...x, amount: split }));
                });
            } else {
                setSelectedUsers((prev) => {
                    const rest = prev.filter((x) => x.user.id != groupUser.id);

                    return rest;
                });
            }
        }
    };

    const userTotal = selectedUsers.reduce(
        (partialSum, x) => partialSum + x.amount,
        0
    );
    const isCovered = userTotal == price ? 0 : userTotal < price ? -1 : 1;

    const onChangeSplitType = (val: string) => {
        if (val != "equal" && val != "custom") return;

        setSplitType(val);

        // Calculate even split for users
        const newSplit =
            selectedUsers.length == 0 ? 0 : price / selectedUsers.length;
        setSelectedUsers((prev) =>
            prev.map((x) => ({ ...x, amount: newSplit }))
        );
    };

    return (
        <div className="px-4 space-y-12">
            <Tabs
                value={currentTab}
                onValueChange={(val) => setCurrentTab(val)}
            >
                <TabsList>
                    <TabsTrigger value="details">1. Details</TabsTrigger>
                    <TabsTrigger value="price-and-type">
                        2. Price and Type
                    </TabsTrigger>
                    <TabsTrigger value="split">3. Split</TabsTrigger>
                    <TabsTrigger value="review">4. Review</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-2">
                    <div className="border p-4 rounded-md space-y-8 min-h-[60vh] ">
                        <div>
                            <Label htmlFor="select-type">Type</Label>
                            <Select>
                                <SelectTrigger
                                    className="w-[180px]"
                                    id="select-type"
                                >
                                    <SelectValue placeholder="Charge type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="taxi">
                                        🚕 Taxi
                                    </SelectItem>
                                    <SelectItem value="food">
                                        🍽️ Food
                                    </SelectItem>
                                    <SelectItem value="bus">🚌 Bus</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="charge-name">
                                Name{" "}
                                <span className="text-xs text-muted-foreground">
                                    {"(optional)"}
                                </span>
                            </Label>
                            <Input id={"charge-name"} />
                        </div>
                        <div>
                            <Label htmlFor="charge-notes">
                                Notes{" "}
                                <span className="text-xs text-muted-foreground">
                                    {"(optional)"}
                                </span>
                            </Label>
                            <Textarea
                                className="rounded-sm"
                                id={"charge-notes"}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={() => setCurrentTab("price-and-type")}
                            variant={"ghost"}
                        >
                            <span>Price and type</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="price-and-type" className="space-y-2">
                    <div className="border p-4 rounded-md space-y-2 min-h-[60vh]">
                        <div className="">
                            <NumberFormatInput
                                prefix="$"
                                allowNegative={false}
                                allowLeadingZeros={false}
                                onChange={(e) =>
                                    setPrice(Number(e.target.value))
                                }
                            />
                        </div>

                        <Button className="space-x-2">
                            {/* <PlusIcon /> */}
                            <span>Add receipt</span>
                            <span className="text-xs text-muted">
                                {"(optional)"}
                            </span>
                        </Button>
                    </div>
                    <div className="flex justify-between">
                        <Button
                            onClick={() => setCurrentTab("details")}
                            variant={"ghost"}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>details</span>
                        </Button>
                        <Button
                            onClick={() => setCurrentTab("split")}
                            variant={"ghost"}
                        >
                            <span>Split</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="split" className="space-y-2">
                    <div>
                        <div className="border p-4 rounded-md space-y-2 min-h-[60vh]">
                            <div className="flex justify-center ">
                                <div className="w-fit bg-secondary p-3 flex items-center rounded-sm gap-2">
                                    <div className="flex">
                                        <ToggleGroup
                                            type="single"
                                            value={splitType}
                                            onValueChange={(val) =>
                                                onChangeSplitType(val)
                                            }
                                        >
                                            <ToggleGroupItem
                                                value="equal"
                                                aria-label="Toggle equal"
                                            >
                                                equal split
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                value="custom"
                                                aria-label="Toggle custom"
                                            >
                                                custom split
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="search-term">
                                        Add users
                                    </Label>
                                    <Input
                                        className="w-[18rem] md:w-[22rem]"
                                        id="search-term"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <Button>Clear Search</Button>
                            </div>

                            {data
                                .filter((x) => x.name?.includes(searchTerm))
                                .sort((x) =>
                                    selectedUsers.find(
                                        (selectedUser) =>
                                            selectedUser.user.id == x.id
                                    ) != null
                                        ? -1
                                        : 1
                                )
                                .map((groupUser) => {
                                    const isUs =
                                        user != null &&
                                        user?.id == groupUser.user_id;
                                    const userSelected = selectedUsers.find(
                                        (x) => x.user.id == groupUser.id
                                    );
                                    const isSelected = userSelected != null;

                                    return (
                                        <UserRow
                                            groupUser={groupUser}
                                            isSelected={isSelected}
                                            isUs={isUs}
                                            onToggleUser={onToggleUser}
                                        >
                                            {isSelected && (
                                                <NumberFormatInput
                                                    prefix="$"
                                                    disabled={
                                                        !isSelected ||
                                                        splitType == "equal"
                                                    }
                                                    value={userSelected?.amount}
                                                    onChange={(e) =>
                                                        setSelectedUsers(
                                                            (prev) =>
                                                                prev.map(
                                                                    (x) => {
                                                                        if (
                                                                            x
                                                                                .user
                                                                                .id ==
                                                                            groupUser.id
                                                                        )
                                                                            return {
                                                                                ...x,
                                                                                amount: Number(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                ),
                                                                            };

                                                                        return x;
                                                                    }
                                                                )
                                                        )
                                                    }
                                                />
                                            )}
                                        </UserRow>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Button
                            onClick={() => setCurrentTab("price-and-type")}
                            variant={"ghost"}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Price and type</span>
                        </Button>
                        <Button
                            onClick={() => setCurrentTab("review")}
                            variant={"ghost"}
                        >
                            <span>Review</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="review" className="space-y-2">
                    <div className="border p-4 rounded-md space-y-2 min-h-[60vh]">
                        <div className="p-4 rounded-md bg-secondary flex flex-col items-center">
                            <div className="flex items-center text-sm font-bold">
                                <div className="p-[20px] box-border bg-background w-[1.5rem] h-[1.5rem] flex justify-center items-center rounded-md">
                                    {"$"}
                                </div>
                                <div className="bg-background  py-2 rounded-lg flex items-center min-w-[8rem] justify-center">
                                    {price}
                                </div>
                                <div className=" bg-background py-2 px-4 rounded-md ">
                                    {selectedUsers.length} people
                                </div>
                                <div className=" bg-background py-2 px-4 rounded-md ">
                                    {isCovered == 0 && "covered"}
                                    {isCovered == -1 && "too little"}
                                    {isCovered == 1 && "too much"}
                                </div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Button
                            onClick={() => setCurrentTab("split")}
                            variant={"ghost"}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Split</span>
                        </Button>
                        <Button>Create charge</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
