import React, { ReactNode } from "react";

export default function ErrorMessage({ children }: { children: ReactNode }) {
  return <div className="border rounded-sm p-3 text-red-400">{children}</div>;
}
