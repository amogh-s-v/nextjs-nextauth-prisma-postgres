import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (session?.user) {
    return <div>welcome to admin page {session?.user.username}</div>;
  } else {
    return <div> Please Login </div>;
  }
};

export default page;
