import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Root from "@/routes/root.tsx";

import ErrorPage from "@/routes/error-page.tsx";
import GroupPage from "@/routes/groups/(id)/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ProfilePage from "@/routes/groups/(id)/profile/page.tsx";
import GroupsPage from "@/routes/groups/page.tsx";
import ChargePage from "@/routes/groups/(id)/charge/page.tsx";
import { ThemeProvider } from "./components/theme-provider";
import CreateUserPage from "./routes/groups/(id)/create-user/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "groups", element: <GroupsPage />, errorElement: <ErrorPage /> },
      {
        path: "groups/:id",
        element: <GroupPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "groups/:id/profile",
        element: <ProfilePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "groups/:id/charge",
        element: <ChargePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "groups/:id/create-user",
        element: <CreateUserPage />,
        errorElement: <ErrorPage />,
      },
    ],
    // loader: rootLoader,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
