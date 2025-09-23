// lib/getUserServer.ts
import { User } from "@/generated/graphql";
import { sdk } from "@/utils/graphqlClient";
import { cookies, headers } from "next/headers";

export async function getUserServer() {
  try {
    const cookieStore = await cookies();
    const res = await sdk.meUser({}, { cookie: cookieStore.toString() });
    if (res && res.meUser) {
      return (res?.meUser as User) ?? null;
    }
  } catch (err) {
    console.warn("Failed to fetch current user on server", err);
    return null;
  }
}
