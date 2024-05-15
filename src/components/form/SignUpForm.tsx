"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  TextField,
  Button,
  Typography,
  Link,
  Box,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation"; // Correct import for Next.js router

const FormSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const SignUpForm = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      router.push("/sign-in");
    } else {
      console.error("Couldn't Signup");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      maxWidth={400}
      mx="auto"
      mt={4}
      p={2}
    >
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        {...register("username")}
        error={!!errors.username}
        helperText={errors.username?.message}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        type="email"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        type="password"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Confirm Password"
        variant="outlined"
        fullWidth
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        type="password"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        type="submit"
        sx={{ mb: 2 }}
      >
        Sign Up
      </Button>
      <Divider sx={{ my: 2 }}>or</Divider>
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ mt: 2 }}
      >
        If you already have an account, please{" "}
        <Link href="/sign-in" underline="hover" color="primary">
          Sign in
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUpForm;
