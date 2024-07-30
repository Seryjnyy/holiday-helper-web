import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import GoBackLeft from "@/components/go-back-left";
import Loading from "@/components/loading";
import AvatarUser from "@/components/ui/avatar-user";
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
import { ArrowLeft, ArrowRight, Currency, PlusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import AvatarUser from "@/components/ui/avatar-user";
import { H4, P } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { NumberFormatInput } from "@/components/ui/number-format-input";
import { GroupUser } from "@/types";
import { cn, currencyToSymbol } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { SplitType } from "@/types";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  currency: z.string().min(1, "why it so short?").max(10, "Why is it so long?"),
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

const Details = ({ form }: { form: UseFormReturn<CreateChargeSchemaType> }) => {
  return (
    <div className="border p-4 rounded-md space-y-8 min-h-[60vh] ">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <Select
                {...field}
                value={form.getValues().type}
                onValueChange={(val) => form.setValue("type", val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="taxi">🚕 Taxi</SelectItem>
                  <SelectItem value="food">🍽️ Food</SelectItem>
                  <SelectItem value="bus">🚌 Bus</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>Select the type of charge.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Name{" "}
              <span className="text-xs text-muted-foreground">
                {"(optional)"}
              </span>
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              You can give the charge a name, or it will be created
              automatically.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Notes{" "}
              <span className="text-xs text-muted-foreground">
                {"(optional)"}
              </span>
            </FormLabel>
            <FormControl>
              <Textarea className="rounded-sm" {...field} />
            </FormControl>
            <FormDescription>You can write extra stuff here.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const PriceAndType = ({
  form,
}: {
  form: UseFormReturn<CreateChargeSchemaType>;
}) => {
  return (
    <div className="border p-4 rounded-md space-y-2 min-h-[60vh]">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <NumberFormatInput
                prefix="$"
                allowNegative={false}
                allowLeadingZeros={false}
                {...field}
              />
            </FormControl>
            <FormDescription>How much did this cost?</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button className="space-x-2">
        {/* <PlusIcon /> */}
        <span>Add receipt</span>
        <span className="text-xs text-muted">{"(optional)"}</span>
      </Button>
    </div>
  );
};

const Split = ({
  form,
  groupID,
}: {
  form: UseFormReturn<CreateChargeSchemaType>;
  groupID: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["groupUsers", groupID ?? ""],
    queryFn: () => getGroupUsers(groupID ?? ""),
    retry: false,
    refetchOnWindowFocus: false,
  });
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // If split equally then
    // if price changes update users split
    // if custom do nothing
    const formValues = form.getValues();
    if (formValues.splitType == "equal") {
      const splitLength = formValues.split.length;
      const split = formValues.price / splitLength;

      form.setValue(
        "split",
        formValues.split.map((x) => ({ ...x, amount: split }))
      );
    }
  }, [form.getValues().price]);

  useEffect(() => {
    // TODO : Duplicate code with useEffect on price

    // If type changed to equal, divide the cost equally
    const formValues = form.getValues();
    if (formValues.splitType == "equal") {
      const splitLength = formValues.split.length;
      const split = formValues.price / splitLength;

      form.setValue(
        "split",
        formValues.split.map((x) => ({ ...x, amount: split }))
      );
    }
  }, [form.getValues().splitType]);

  const onToggleUser = (groupUser: GroupUser) => {
    const formValues = form.getValues();

    const isSelected =
      formValues.split.find((x) => x.groupUserID == groupUser.id) != null;

    if (!isSelected) {
      if (formValues.splitType == "equal") {
        const split =
          formValues.price == 0
            ? 0
            : formValues.price / (formValues.split.length + 1);
        const splitList = [...formValues.split];
        splitList.push({ groupUserID: groupUser.id, amount: split });
        form.setValue(
          "split",
          splitList.map((x) => ({ ...x, amount: split }))
        );
      } else {
        const splitList = [...formValues.split];
        splitList.push({ groupUserID: groupUser.id, amount: 0 });
        form.setValue(
          "split",
          splitList.map((x) => ({ ...x }))
        );
      }
    } else {
      if (formValues.splitType == "equal") {
        const remaining = formValues.split.filter(
          (x) => x.groupUserID != groupUser.id
        );
        const split =
          remaining.length == 0 ? 0 : formValues.price / remaining.length;
        form.setValue(
          "split",
          remaining.map((x) => ({ ...x, amount: split }))
        );
      } else {
        const remaining = formValues.split.filter(
          (x) => x.groupUserID != groupUser.id
        );
        form.setValue("split", remaining);
      }
    }
  };

  // const userTotal = selectedUsers.reduce(
  //     (partialSum, x) => partialSum + x.amount,
  //     0
  // );
  // const isCovered = userTotal == price ? 0 : userTotal < price ? -1 : 1;

  if (isPending) {
    return <Loading />;
  }

  if (isError) return <div>Error {error.message}</div>;

  return (
    <div className="border p-4 rounded-md space-y-2 min-h-[60vh]">
      <div className="flex justify-center gap-8">
        <div className="flex flex-col items-center w-fit">
          <div className="bg-secondary-foreground text-secondary w-fit p-3 rounded-full font-bold">
            {currencyToSymbol(form.getValues().currency)}
            {form.getValues().price}
          </div>
          <span className="w-fit text-sm">Need</span>
        </div>
        <div className="flex flex-col items-center w-fit">
          <div className="bg-primary-foreground text-primary w-fit p-3 rounded-full font-bold">
            {currencyToSymbol(form.getValues().currency)}
            {form.getValues().split
              ? form
                  .getValues()
                  .split?.reduce((partialSum, x) => partialSum + x.amount, 0)
              : 0}
          </div>
          <span className="w-fit text-sm">Have</span>
        </div>
      </div>
      <div className="flex justify-center ">
        <div className="w-fit bg-secondary p-3 flex items-center rounded-sm gap-2">
          <div className="flex">
            <FormField
              control={form.control}
              name="splitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split type</FormLabel>
                  <FormControl>
                    <ToggleGroup type="single" {...field}>
                      <ToggleGroupItem value="equal" aria-label="Toggle equal">
                        equal split
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="custom"
                        aria-label="Toggle custom"
                      >
                        custom split
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormDescription>Choose Split type.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="search-term">Add users</Label>
          <Input
            className="w-[18rem] md:w-[22rem]"
            id="search-term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>Clear Search</Button>
      </div>

      {data
        .filter((x) => x.name?.includes(searchTerm))
        .sort((x) =>
          form
            .getValues()
            .split.find((selectedUser) => selectedUser.user.id == x.id) != null
            ? -1
            : 1
        )
        .map((groupUser) => {
          const isUs = user != null && user?.id == groupUser.user_id;
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
                    !isSelected || form.getValues().splitType == "equal"
                  }
                  value={userSelected?.amount}
                  onChange={(e) =>
                    setSelectedUsers((prev) =>
                      prev.map((x) => {
                        if (x.user.id == groupUser.id)
                          return {
                            ...x,
                            amount: Number(e.target.value),
                          };

                        return x;
                      })
                    )
                  }
                />
              )}
            </UserRow>
          );
        })}
    </div>
  );
};

const Review = () => {};

export default function CreateCharge({ groupID }: { groupID: string }) {
  const form = useForm<CreateChargeSchemaType>({
    resolver: zodResolver(CreateChargeSchema),
    defaultValues: {
      name: "",
      notes: "",
      price: 0,
      splitType: "equal",
      currency: "GBP",
      split: [],
    },
  });

  const onSubmit = (values: CreateChargeSchemaType) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
  };

  const [currentTab, setCurrentTab] = useState<CurrentTabs>("details");

  const user = useAuthStore((state) => state.user);

  return (
    <Form {...form}>
      <div className="px-4 space-y-12">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val)}>
            <TabsList>
              <TabsTrigger value="details">1. Details</TabsTrigger>
              <TabsTrigger value="price-and-type">
                2. Price and Type
              </TabsTrigger>
              <TabsTrigger value="split">3. Split</TabsTrigger>
              <TabsTrigger value="review">4. Review</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-2">
              <Details form={form} />
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
              <PriceAndType form={form} />
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
              <Split form={form} groupID={groupID} />
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
                      {currencyToSymbol(form.getValues().currency)}
                    </div>
                    <div className="bg-background  py-2 rounded-lg flex items-center min-w-[8rem] justify-center">
                      {form.getValues().price}
                    </div>
                    <div className=" bg-background py-2 px-4 rounded-md ">
                      {form.getValues().split
                        ? form.getValues().split.length
                        : 0}{" "}
                      people
                    </div>
                    {/* <div className=" bg-background py-2 px-4 rounded-md ">
                                            {isCovered == 0 && "covered"}
                                            {isCovered == -1 && "too little"}
                                            {isCovered == 1 && "too much"}
                                        </div> */}
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
        </form>
      </div>
    </Form>
  );

  return (
    <div className="px-4 space-y-12">
      <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val)}>
        <TabsList>
          <TabsTrigger value="details">1. Details</TabsTrigger>
          <TabsTrigger value="price-and-type">2. Price and Type</TabsTrigger>
          <TabsTrigger value="split">3. Split</TabsTrigger>
          <TabsTrigger value="review">4. Review</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-2">
          <div className="border p-4 rounded-md space-y-8 min-h-[60vh] ">
            <div>
              <Label htmlFor="select-type">Type</Label>
              <Select>
                <SelectTrigger className="w-[180px]" id="select-type">
                  <SelectValue placeholder="Charge type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="taxi">🚕 Taxi</SelectItem>
                  <SelectItem value="food">🍽️ Food</SelectItem>
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
              <Textarea className="rounded-sm" id={"charge-notes"} />
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
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <Button className="space-x-2">
              {/* <PlusIcon /> */}
              <span>Add receipt</span>
              <span className="text-xs text-muted">{"(optional)"}</span>
            </Button>
          </div>
          <div className="flex justify-between">
            <Button onClick={() => setCurrentTab("details")} variant={"ghost"}>
              <ArrowLeft className="w-4 h-4" />
              <span>details</span>
            </Button>
            <Button onClick={() => setCurrentTab("split")} variant={"ghost"}>
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
                      onValueChange={(val) => onChangeSplitType(val)}
                    >
                      <ToggleGroupItem value="equal" aria-label="Toggle equal">
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
                  <Label htmlFor="search-term">Add users</Label>
                  <Input
                    className="w-[18rem] md:w-[22rem]"
                    id="search-term"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button>Clear Search</Button>
              </div>

              {data
                .filter((x) => x.name?.includes(searchTerm))
                .sort((x) =>
                  selectedUsers.find(
                    (selectedUser) => selectedUser.user.id == x.id
                  ) != null
                    ? -1
                    : 1
                )
                .map((groupUser) => {
                  const isUs = user != null && user?.id == groupUser.user_id;
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
                          disabled={!isSelected || splitType == "equal"}
                          value={userSelected?.amount}
                          onChange={(e) =>
                            setSelectedUsers((prev) =>
                              prev.map((x) => {
                                if (x.user.id == groupUser.id)
                                  return {
                                    ...x,
                                    amount: Number(e.target.value),
                                  };

                                return x;
                              })
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
            <Button onClick={() => setCurrentTab("review")} variant={"ghost"}>
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
            <Button onClick={() => setCurrentTab("split")} variant={"ghost"}>
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
