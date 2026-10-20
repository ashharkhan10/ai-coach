/**
 * Backend calls for accounts: sign up, log in, read and update profile.
 */
import { apiRequest } from "./client";

export type Goal = "lose_weight" | "build_muscle" | "stay_fit";

export type User = {
  id: number;
  email: string;
  name: string;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  goal: Goal | null;
};

export type ProfileUpdate = Omit<User, "id" | "email">;

type AuthResponse = {
  token: string;
  user: User;
};

export function signup(email: string, password: string, name: string) {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: { email, password, name },
  });
}

export function login(email: string, password: string) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function getMe(token: string) {
  return apiRequest<User>("/me", { token });
}

export function updateMe(token: string, profile: ProfileUpdate) {
  return apiRequest<User>("/me", { method: "PUT", token, body: profile });
}
