"use server";

import { createUser, getUserByEmail } from "@/db/queries/user.queries";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";

const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });
  } catch (error) {
    const someError = error as CredentialsSignin;
    return someError.cause;
  }
  redirect("/");
};

const register = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !phoneNumber || !password) {
    throw new Error("Please fill all required fields");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  // Validate phone number (basic validation)
  const phoneRegex = /^\+?[0-9\s-]+$/;
  if (!phoneRegex.test(phoneNumber)) {
    throw new Error("Please enter a valid phone number");
  }

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) throw new Error("User with this email already exists");

  const hashedPassword = await hash(password, 12);

  await createUser({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phoneNumber: phoneNumber.trim(),
    password: hashedPassword,
  });

  console.log(`User created successfully`);
  redirect("/login");
};

const fetchAllUsers = async () => {
  // Not implemented: You can add a query for all users if needed
  throw new Error("Not implemented");
};

export { register, login, fetchAllUsers };
