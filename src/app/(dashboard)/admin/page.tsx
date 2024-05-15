// /pages/page.tsx
import ChatInterface from "@/components/ChatInterface";
import GetEmo from "@/components/ui/GetEmo";
import { authOptions } from "@/lib/auth";
import { Box, Button, Typography } from "@mui/material"; // Importing Material-UI components
import { getServerSession } from "next-auth";
import React from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <Box mt={8} textAlign="center">
      {session?.user ? (
        // <ChatInterface/>
        <GetEmo/>
      ) : (
        <Typography variant="h6" color="secondary">Please login to access this page</Typography>
      )}
    </Box>
  );
};

export default Page;
