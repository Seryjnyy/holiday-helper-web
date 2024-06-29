import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <div
      id="error-page"
      className="flex justify-center items-center h-[90vh] flex-col"
    >
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="border p-4 mt-8 rounded-md border-blue-300">
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  );
}
