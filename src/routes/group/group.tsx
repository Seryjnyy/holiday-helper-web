import React from "react";
import GoBackLeft from "../../components/GoBackLeft";

export default function Group() {
  return (
    <div>
      <GoBackLeft title="groups" to="/group" />
      <h1>some group name</h1>
    </div>
  );
}
