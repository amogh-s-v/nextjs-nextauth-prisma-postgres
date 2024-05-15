"use client"
import { authOptions } from "@/lib/auth";
import { Button } from "@mui/material";
import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";
import { string } from "zod";

const CreateJournal = ({userid}) => {
  const router = useRouter();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={async () => {
        const res = await fetch("/api/createJournal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({userid: userid}),
        });
        if (res.ok) {
            const data = await res.json();
            console.log("RES JOURNAL", data.journal_id)
            router.push("/journal/" + data.journal_id);
        //   router.push("/sign-in");
        } else {
          console.error("Couldn't Signup");
        }
      }}
    >
      Create New Journal Entry
    </Button>
  );
};

export default CreateJournal;
