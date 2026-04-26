"use server";

import { ProfileDashboard } from "@/components/profile/profile-dashboard";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;

  return <ProfileDashboard locale={local} />;
}
