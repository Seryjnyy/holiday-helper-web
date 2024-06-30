import React, { useEffect } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLoaderData,
  useNavigate,
} from "react-router-dom";

import useAuthStore from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";

export default function Root() {
  const navigate = useNavigate();
  const auth = useAuthStore();

  // useEffect(() => {
  //   const setUp = async () => {

  //   };
  //   setUp();
  // });

  return (
    <div>
      <nav className="border px-2 py-2 flex justify-between bg-secondary mb-6">
        <div>
          <Button onClick={() => navigate("/")}>/</Button>
          <Button onClick={() => navigate("/groups")}>groups</Button>
        </div>
        <div className="flex">
          {auth.session && (
            <div className="flex gap-1 bg-muted items-center rounded-md">
              <span className="text-xs px-2  rounded-lg text-muted-foreground">
                {auth?.session?.user.email}
              </span>
              <Button>
                <UserIcon />
              </Button>
            </div>
          )}
          {!auth.session ? (
            <Button
              onClick={() => {
                auth.login("somemail@gmail.com", "someToughPassword123!");
              }}
            >
              login
            </Button>
          ) : (
            <Button
              onClick={() => {
                auth.logout();
              }}
            >
              log out
            </Button>
          )}
          <Button
            onClick={() => {
              auth.register("somemail@gmail.com", "someToughPassword123!");
            }}
          >
            register
          </Button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

// export async function loader() {
//   const data = await getSomething();

//   return { data };
// }
