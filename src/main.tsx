import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Root from "./routes/root.tsx";

import ErrorPage from "./routes/error-page.tsx";
import GroupPage from "./routes/group/page.tsx";
import Group from "./routes/group/group.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "group", element: <GroupPage />, errorElement: <ErrorPage /> },
      {
        path: "group/:id",
        element: <Group />,
        errorElement: <ErrorPage />,
      },
    ],
    // loader: rootLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
