import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BotIcon, CrownIcon, UserIcon } from "lucide-react";
import React from "react";

// TODO : Hook up name as fallback and the actual avatar image
export default function AvatarUser({
  name,
  role,
  isUs,
}: {
  name: string;
  role: "admin" | "user" | "bot";
  isUs: boolean;
}) {
  return (
    <Avatar className="relative overflow-visible">
      <AvatarImage src="https://github.com/fsdshadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
      <UserIcon className="absolute -bottom-[0.15rem] -right-[0.15rem] bg-secondary rounded-lg z-20 w-4 h-4" />
      {role == "admin" && (
        <CrownIcon className="absolute -bottom-[0.15rem] -left-[0.15rem] bg-secondary rounded-lg z-20 w-4 h-4" />
      )}
      {role == "bot" && (
        <BotIcon className="absolute -bottom-[0.15rem] -left-[0.15rem] bg-secondary rounded-lg z-20 w-4 h-4" />
      )}
    </Avatar>
  );
}
