"use server";

import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <LoginForm locale={local} />
    </div>
  );
}
