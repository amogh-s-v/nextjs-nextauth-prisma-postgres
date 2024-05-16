"use client"
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import React from "react";

const SignOutButton = () => {
  return <Button variant="contained" color="error" onClick={() => signOut({
    redirect: true,
    callbackUrl: `${window.location.origin}/sign-in`,
})}>Sign Out</Button>;
};

export default SignOutButton;
