import React from "react";

const Avatar = ({ username }) => {
  console.log("username", username);
  const splitUsername = username?.split(" ");
  const avatar = splitUsername?.map((avatar) => avatar.charAt(0)).join("");
  console.log(avatar);
  return (
    <div className="w-max">
      <h1 className="text-lg text-white rounded-lg p-3 bg-pink-500">
        {avatar}
      </h1>
    </div>
  );
};

export default Avatar;
