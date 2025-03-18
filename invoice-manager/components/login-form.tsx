// components/LoginForm.tsx
"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" }); // Redirect to dashboard after login
  };

  return (
    <div className={cn("flex flex-col gap-6 opacity-80", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Full of Shift</CardTitle>
          <CardDescription>a simple shift manager & invoice generator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}