import OnboardingForm from "@/components/onboarding/onboardingform";
import { sdk } from "@/utils/graphqlClient";
import { redirect } from "next/navigation";
import React from "react";
import { cookies } from "next/headers";

async function getMeUser() {
  try {
    const cookieStore = await cookies();

    const res = await sdk.meUser({}, { cookie: cookieStore.toString() });
    if (res && res.meUser) {
      return res.meUser;
    }
  } catch (error) {
    return null;
  }
}

async function Page() {
  const user = await getMeUser();
  if (user && user.isProfileCompleted) {
    redirect("/home");
  }

  return <OnboardingForm />;
}

export default Page;
