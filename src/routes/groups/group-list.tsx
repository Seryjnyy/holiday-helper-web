import React, { useEffect, useState } from "react";
import { getGroupsForUser } from "@/services/group";

import UserMissingError from "@/components/user-missing-error";

import { Link } from "react-router-dom";
import useAuthStore from "@/stores/auth-store";
import { Group } from "@/types";

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const setUp = async () => {};

    setUp();
  }, []);

  if (!user) return <UserMissingError />;

  const getGroups = async () => {
    const { data, error } = await getGroupsForUser(user.id);
    if (data) {
      console.log("🚀 ~ getGroups ~ data:", data);

      setGroups(
        data.filter((group) => group.group != null).map((group) => group.group)
      );
    }
  };

  return (
    <div>
      <h2>Group list</h2>
      <button onClick={getGroups}>get groups</button>
      <span>{groups.length} amount</span>
      <div>
        {groups.map((group) => (
          <div key={group.id}>
            <Link to={group.id}>{group.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}