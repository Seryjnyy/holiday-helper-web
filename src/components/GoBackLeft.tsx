import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function GoBackLeft({
  title,
  to,
}: {
  title: string;
  to: string;
}) {
  const navigate = useNavigate();

  const onClickLink = () => {
    navigate(to);
  };

  return (
    <div
      className="group cursor-pointer flex gap-2 m-2 border w-fit"
      onClick={onClickLink}
    >
      <ArrowLeft className="group-hover:-translate-x-2 transition-all " />
      <span className="text-sm">{title}</span>
    </div>
  );
}
