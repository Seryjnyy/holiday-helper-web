import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { addGroupUser } from "@/services/group";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  role: z.enum(["bot"]),
  profileImage: z.string().max(300),
});

// TODO : Avatar thingy is not working rn
export default function CreateUser({ groupID }: { groupID: string }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      role: "bot",
      profileImage: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const { error } = await addGroupUser(
      groupID,
      values.username,
      "",
      values.role
    );

    if (error) {
      toast({
        title: "Failed to create new user.",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "New user created.",
        description: (
          <>
            <span>{`${values.role.toUpperCase()} `}</span>
            <span className="font-bold">{`${values.username} `}</span>
            has been added to the group.`
          </>
        ),
      });

      navigate(`/groups/${groupID}`);
    }
  }
  return (
    <div className="border rounded-md p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="sr-only">
                  Users display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select {...field} disabled>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bot">Bot</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Created users are by default considered bots.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex">
            <Avatar>
              {/* <AvatarImage src="https://github.com/fsdshadcn.png" /> */}
              <AvatarFallback>
                {form.getValues().username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button type="button" disabled variant={"secondary"}>
              Add profile image
            </Button>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
