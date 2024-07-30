import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupRole } from "@/types";
import { BotIcon, CrownIcon, UserIcon } from "lucide-react";

// TODO : Hook up name as fallback and the actual avatar image
export default function AvatarUser({
  role,
  isUs,
}: {
  // name: string;
  role: GroupRole;
  isUs: boolean;
}) {
  return (
    <Avatar className="relative overflow-visible">
      <AvatarImage src="https://github.com/fsdshadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
      {isUs && (
        <UserIcon className="absolute -bottom-[0.15rem] -right-[0.15rem] bg-secondary rounded-lg z-20 w-4 h-4" />
      )}
      {role == "admin" && (
        <CrownIcon className="absolute -bottom-[0.15rem] -left-[0.15rem] bg-secondary rounded-lg z-20 w-4 h-4" />
      )}
      {role == "bot" && (
        <BotIcon className="absolute -bottom-[0.15rem] -left-[0.15rem] bg-secondary rounded-lg z-20 w-4 h-4" />
      )}
    </Avatar>
  );
}
