import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Loading({
  loadingMessage,
}: {
  loadingMessage?: string;
}) {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <LoaderCircle className="animate-spin" />
      <span className="text-sm opacity-80 mt-4">{loadingMessage}</span>
    </div>
  );
}
