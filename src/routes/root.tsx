import React, { useEffect } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLoaderData,
  useNavigate,
} from "react-router-dom";

import useAuthStore from "@/stores/auth-store";

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
      <nav className="border px-2 flex justify-between">
        <div>
          <button onClick={() => navigate("/")}>/</button>
          <button onClick={() => navigate("/group")}>group</button>
        </div>
        <div>
          <span className="text-sm px-2">{auth?.session?.user.email}</span>
          {!auth.session ? (
            <button
              onClick={() => {
                auth.login("somemail@gmail.com", "someToughPassword123!");
              }}
            >
              login
            </button>
          ) : (
            <button
              onClick={() => {
                auth.logout();
              }}
            >
              log out
            </button>
          )}
          <button
            onClick={() => {
              auth.register("somemail@gmail.com", "someToughPassword123!");
            }}
          >
            register
          </button>
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
