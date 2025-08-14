import OnboardingForm from "@/components/onboarding/onboardingform";
import { sdk } from "@/utils/graphqlClient";
import { redirect } from "next/navigation";
import React from "react";
import { cookies, headers } from "next/headers";
import DashBoard from "@/components/dashboard/dashboardpage";

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
  // if (!user || !user.isProfileCompleted) {
  //   redirect("/onboarding");
  // }

  return (
    <div className="text-white">
      <DashBoard />
    </div>
  );
}

export default Page;
