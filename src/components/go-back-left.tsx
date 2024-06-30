import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function GoBackLeft({
  title,
  to,
}: {
  title: string;
  to: string;
}) {
  return (
    <Link
      className="group cursor-pointer flex gap-1 mt-2 items-center border w-fit h-fit bg-secondary rounded-lg py-1 px-2 hover:bg-secondary-foreground transition-all hover:text-secondary"
      to={to}
    >
      <ArrowLeft className="group-hover:-translate-x-1 transition-all w-4 h-4" />
      <span className="text-xs  ">{title.toLocaleLowerCase()}</span>
    </Link>
  );
}
