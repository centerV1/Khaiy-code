import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <SignupForm locale={local} />
    </div>
  );
}
